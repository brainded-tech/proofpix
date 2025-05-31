import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Star, 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  Clock, 
  TrendingUp, 
  Filter,
  Search,
  Download,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User
} from 'lucide-react';

interface LeadData {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  jobTitle?: string;
  companySize?: string;
  useCase?: string;
  industry?: string;
  urgency?: 'low' | 'medium' | 'high';
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'demo_scheduled' | 'closed';
  createdAt: Date;
  lastActivity?: Date;
  notes?: string;
}

interface AutomationStatus {
  leadId: string;
  sequenceId: string;
  startedAt: Date;
  emails: {
    delay: number;
    subject: string;
    scheduledFor: Date;
    status: 'scheduled' | 'sent' | 'opened' | 'clicked';
    openedAt?: Date;
    clickedAt?: Date;
  }[];
}

export const LeadManagementDashboard: React.FC = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [automations, setAutomations] = useState<AutomationStatus[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);

  useEffect(() => {
    // Load leads from localStorage (in production, this would be from your CRM API)
    const storedLeads = JSON.parse(localStorage.getItem('proofpix_leads') || '[]');
    const storedAutomations = JSON.parse(localStorage.getItem('proofpix_automations') || '[]');
    
    // Parse dates
    const parsedLeads = storedLeads.map((lead: any) => ({
      ...lead,
      createdAt: new Date(lead.createdAt),
      lastActivity: lead.lastActivity ? new Date(lead.lastActivity) : undefined
    }));
    
    const parsedAutomations = storedAutomations.map((automation: any) => ({
      ...automation,
      startedAt: new Date(automation.startedAt),
      emails: automation.emails.map((email: any) => ({
        ...email,
        scheduledFor: new Date(email.scheduledFor),
        openedAt: email.openedAt ? new Date(email.openedAt) : undefined,
        clickedAt: email.clickedAt ? new Date(email.clickedAt) : undefined
      }))
    }));
    
    setLeads(parsedLeads);
    setAutomations(parsedAutomations);
  }, []);

  useEffect(() => {
    let filtered = leads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Score filter
    if (scoreFilter !== 'all') {
      if (scoreFilter === 'high') {
        filtered = filtered.filter(lead => lead.score >= 70);
      } else if (scoreFilter === 'medium') {
        filtered = filtered.filter(lead => lead.score >= 40 && lead.score < 70);
      } else if (scoreFilter === 'low') {
        filtered = filtered.filter(lead => lead.score < 40);
      }
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, scoreFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'demo_scheduled': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const updateLeadStatus = (leadId: string, newStatus: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus as any, lastActivity: new Date() }
        : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('proofpix_leads', JSON.stringify(updatedLeads));
  };

  const addNote = (leadId: string, note: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, notes: note, lastActivity: new Date() }
        : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('proofpix_leads', JSON.stringify(updatedLeads));
  };

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Company', 'Job Title', 'Industry', 'Score', 'Status', 'Created', 'Use Case'].join(','),
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.company,
        lead.jobTitle || '',
        lead.industry || '',
        lead.score,
        lead.status,
        lead.createdAt.toLocaleDateString(),
        lead.useCase || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proofpix-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    demoScheduled: leads.filter(l => l.status === 'demo_scheduled').length,
    avgScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0,
    highValue: leads.filter(l => l.score >= 70).length
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lead Management Dashboard</h1>
          <p className="text-slate-600">Track and manage your enterprise prospects</p>
        </div>
        <button
          onClick={exportLeads}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Leads
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">New</p>
              <p className="text-2xl font-bold text-slate-900">{stats.new}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Qualified</p>
              <p className="text-2xl font-bold text-slate-900">{stats.qualified}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Demo Scheduled</p>
              <p className="text-2xl font-bold text-slate-900">{stats.demoScheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Avg Score</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avgScore}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">High Value</p>
              <p className="text-2xl font-bold text-slate-900">{stats.highValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-slate-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="demo_scheduled">Demo Scheduled</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center">
            <Star className="h-5 w-5 text-slate-400 mr-2" />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Scores</option>
              <option value="high">High (70+)</option>
              <option value="medium">Medium (40-69)</option>
              <option value="low">Low (&lt;40)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                        <div className="text-sm text-slate-500">{lead.email}</div>
                        {lead.jobTitle && (
                          <div className="text-xs text-slate-400">{lead.jobTitle}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm text-slate-900">{lead.company}</div>
                        {lead.industry && (
                          <div className="text-xs text-slate-500">{lead.industry}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className={`h-4 w-4 mr-1 ${getScoreColor(lead.score)}`} />
                      <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(lead.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="demo_scheduled">Demo Scheduled</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getUrgencyColor(lead.urgency || 'low')}`}>
                      {lead.urgency || 'low'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {lead.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://calendly.com/proofpix-enterprise`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Calendar className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Lead Details</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <p className="text-slate-900">{selectedLead.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <p className="text-slate-900">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Company</label>
                    <p className="text-slate-900">{selectedLead.company}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Job Title</label>
                    <p className="text-slate-900">{selectedLead.jobTitle || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Industry</label>
                    <p className="text-slate-900">{selectedLead.industry || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Company Size</label>
                    <p className="text-slate-900">{selectedLead.companySize || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Use Case</label>
                  <p className="text-slate-900">{selectedLead.useCase || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Notes</label>
                  <textarea
                    value={selectedLead.notes || ''}
                    onChange={(e) => addNote(selectedLead.id, e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this lead..."
                  />
                </div>

                <div className="flex space-x-4">
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                  <a
                    href="https://calendly.com/proofpix-enterprise"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagementDashboard; 