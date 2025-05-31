/**
 * Salesforce Integration Panel - Priority 15
 * Detailed Salesforce CRM integration management interface
 */

import React, { useState, useEffect } from 'react';
import { useSalesforceIntegration } from '../../hooks/useEnterpriseIntegrations';

interface SalesforceRecord {
  id: string;
  type: 'lead' | 'opportunity' | 'contact' | 'account';
  name: string;
  email?: string;
  company?: string;
  amount?: number;
  stage?: string;
  status?: string;
  lastModified: Date;
}

const SalesforceIntegrationPanel: React.FC = () => {
  const { syncHistory, lastSync, syncStats, syncing, error, syncData } = useSalesforceIntegration();
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState<SalesforceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Simulate Salesforce records
  useEffect(() => {
    const mockRecords: SalesforceRecord[] = [
      {
        id: 'lead_001',
        type: 'lead',
        name: 'John Smith',
        email: 'john.smith@company.com',
        company: 'Tech Corp',
        status: 'New',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'opp_001',
        type: 'opportunity',
        name: 'Enterprise License Deal',
        company: 'Big Corp',
        amount: 50000,
        stage: 'Proposal',
        lastModified: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'contact_001',
        type: 'contact',
        name: 'Sarah Johnson',
        email: 'sarah.j@enterprise.com',
        company: 'Enterprise Inc',
        lastModified: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: 'account_001',
        type: 'account',
        name: 'Global Solutions Ltd',
        lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ];
    setRecords(mockRecords);
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getRecordIcon = (type: string) => {
    const icons = {
      lead: '👤',
      opportunity: '💰',
      contact: '📞',
      account: '🏢'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getStatusColor = (type: string, status?: string, stage?: string) => {
    if (type === 'lead') {
      switch (status) {
        case 'New': return 'bg-blue-100 text-blue-800';
        case 'Qualified': return 'bg-green-100 text-green-800';
        case 'Unqualified': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    if (type === 'opportunity') {
      switch (stage) {
        case 'Prospecting': return 'bg-yellow-100 text-yellow-800';
        case 'Proposal': return 'bg-blue-100 text-blue-800';
        case 'Negotiation': return 'bg-purple-100 text-purple-800';
        case 'Closed Won': return 'bg-green-100 text-green-800';
        case 'Closed Lost': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    return 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'records', name: 'Records', icon: '📋' },
    { id: 'sync', name: 'Sync History', icon: '🔄' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🏢</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Salesforce Integration</h2>
            <p className="text-gray-600">Manage your Salesforce CRM integration</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Connected
          </span>
          <button
            onClick={syncData}
            disabled={syncing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">👤</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {records.filter(r => r.type === 'lead').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💰</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Opportunities</p>
                  <p className="text-2xl font-bold text-green-600">
                    {records.filter(r => r.type === 'opportunity').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📞</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contacts</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {records.filter(r => r.type === 'contact').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏢</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Accounts</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {records.filter(r => r.type === 'account').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          {lastSync && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Last Sync Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Records Processed</p>
                  <p className="font-semibold">{lastSync.recordsProcessed}</p>
                </div>
                <div>
                  <p className="text-gray-600">Records Created</p>
                  <p className="font-semibold text-green-600">{lastSync.recordsCreated}</p>
                </div>
                <div>
                  <p className="text-gray-600">Records Updated</p>
                  <p className="font-semibold text-blue-600">{lastSync.recordsUpdated}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-semibold">{lastSync.duration}ms</p>
                </div>
              </div>
            </div>
          )}

          {/* Sync Statistics */}
          {syncStats && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Sync Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Syncs</p>
                  <p className="font-semibold">{syncStats.totalSyncs}</p>
                </div>
                <div>
                  <p className="text-gray-600">Success Rate</p>
                  <p className="font-semibold text-green-600">{syncStats.successRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Records</p>
                  <p className="font-semibold">{syncStats.totalRecords}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Duration</p>
                  <p className="font-semibold">{syncStats.averageDuration}ms</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'records' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="lead">Leads</option>
              <option value="opportunity">Opportunities</option>
              <option value="contact">Contacts</option>
              <option value="account">Accounts</option>
            </select>
          </div>

          {/* Records List */}
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getRecordIcon(record.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{record.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="capitalize">{record.type}</span>
                        {record.email && <span>• {record.email}</span>}
                        {record.company && <span>• {record.company}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {record.amount && (
                      <p className="font-semibold text-green-600">${record.amount.toLocaleString()}</p>
                    )}
                    {(record.status || record.stage) && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.type, record.status, record.stage)}`}>
                        {record.status || record.stage}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {record.lastModified.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No records found matching your criteria.
            </div>
          )}
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sync History</h3>
            <button
              onClick={syncData}
              disabled={syncing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          <div className="space-y-3">
            {syncHistory.map((sync, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${sync.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="font-medium">
                      {sync.success ? 'Successful Sync' : 'Failed Sync'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {sync.timestamp.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Processed</p>
                    <p className="font-semibold">{sync.recordsProcessed}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-semibold text-green-600">{sync.recordsCreated}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Updated</p>
                    <p className="font-semibold text-blue-600">{sync.recordsUpdated}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold">{sync.duration}ms</p>
                  </div>
                </div>

                {sync.errors.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 rounded">
                    <p className="text-sm font-medium text-red-800">Errors:</p>
                    <ul className="text-sm text-red-700 list-disc list-inside">
                      {sync.errors.map((error, errorIndex) => (
                        <li key={errorIndex}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {syncHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No sync history available. Run your first sync to see results here.
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sync Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sync Contacts</p>
                  <p className="text-sm text-gray-600">Automatically sync Salesforce contacts</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sync Leads</p>
                  <p className="text-sm text-gray-600">Automatically sync Salesforce leads</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sync Opportunities</p>
                  <p className="text-sm text-gray-600">Automatically sync Salesforce opportunities</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Create Tasks</p>
                  <p className="text-sm text-gray-600">Create Salesforce tasks for document processing</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Sync Frequency</h3>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="realtime">Real-time</option>
              <option value="hourly" selected>Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Field Mapping</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Document Name → Salesforce Subject</span>
                <span className="text-green-600">✓ Mapped</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Upload Date → Salesforce Created Date</span>
                <span className="text-green-600">✓ Mapped</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Processing Status → Custom Field</span>
                <span className="text-green-600">✓ Mapped</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesforceIntegrationPanel; 