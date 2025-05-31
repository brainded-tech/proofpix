import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Trash2, 
  Plus, 
  RefreshCw, 
  AlertTriangle,
  Check,
  FileText,
  Mail,
  Users,
  Edit
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { analyticsPermissionService } from '../../services/analyticsPermissionService';

interface ScheduledReport {
  id: string;
  name: string;
  description?: string;
  dashboardId?: string;
  metricIds: string[];
  format: 'pdf' | 'csv' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6, Sunday to Saturday (for weekly)
  dayOfMonth?: number; // 1-31 (for monthly)
  recipients: string[];
  createdBy: string;
  createdAt: Date;
  lastSentAt?: Date;
  nextScheduledAt: Date;
  active: boolean;
}

interface ScheduledReportsManagerProps {
  dashboardId?: string;
  theme?: 'light' | 'dark';
  availableMetrics?: Array<{
    id: string;
    name: string;
    category?: string;
  }>;
  onCreateReport?: (report: ScheduledReport) => void;
  onDeleteReport?: (reportId: string) => void;
}

export const ScheduledReportsManager: React.FC<ScheduledReportsManagerProps> = ({
  dashboardId,
  theme = 'light',
  availableMetrics = [],
  onCreateReport,
  onDeleteReport
}) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  
  // New report form state
  const [newReport, setNewReport] = useState<{
    name: string;
    description: string;
    metricIds: string[];
    format: 'pdf' | 'csv' | 'excel';
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek: number;
    dayOfMonth: number;
    recipients: string;
  }>({
    name: '',
    description: '',
    metricIds: [],
    format: 'pdf',
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    dayOfMonth: 1,
    recipients: ''
  });
  
  // Check permission
  const checkReportPermission = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const hasPermission = await analyticsPermissionService.hasPermission(
        user,
        'schedule_reports',
        dashboardId
      );
      
      return hasPermission;
    } catch (error) {
      console.error('Error checking report permission:', error);
      return false;
    }
  };
  
  // Load reports
  useEffect(() => {
    loadReports();
  }, [dashboardId, user]);
  
  const loadReports = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check permission first
      const hasPermission = await checkReportPermission();
      if (!hasPermission) {
        setError('You do not have permission to schedule reports');
        setReports([]);
        return;
      }
      
      // In a real app, this would fetch from an API
      // For demo purposes, we'll create mock data
      
      // Load from localStorage
      const storedReports = localStorage.getItem(`scheduled_reports_${user.id}`);
      if (storedReports) {
        const parsedReports = JSON.parse(storedReports) as ScheduledReport[];
        
        // Filter by dashboard if specified
        const filteredReports = dashboardId 
          ? parsedReports.filter(r => r.dashboardId === dashboardId)
          : parsedReports;
        
        // Convert date strings to Date objects
        filteredReports.forEach(report => {
          report.createdAt = new Date(report.createdAt);
          report.nextScheduledAt = new Date(report.nextScheduledAt);
          if (report.lastSentAt) {
            report.lastSentAt = new Date(report.lastSentAt);
          }
        });
        
        setReports(filteredReports);
      } else {
        // Create sample data for demo
        if (!dashboardId) {
          const sampleReports: ScheduledReport[] = [
            {
              id: 'report-1',
              name: 'Weekly Performance Summary',
              description: 'Summary of key performance metrics',
              metricIds: ['file_count', 'processing_time', 'api_usage'],
              format: 'pdf',
              frequency: 'weekly',
              dayOfWeek: 1, // Monday
              recipients: ['admin@example.com'],
              createdBy: user.id,
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              lastSentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              nextScheduledAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
              active: true
            },
            {
              id: 'report-2',
              name: 'Monthly Usage Report',
              description: 'Detailed usage statistics for billing',
              metricIds: ['storage_used', 'api_usage', 'active_users'],
              format: 'excel',
              frequency: 'monthly',
              dayOfMonth: 1,
              recipients: ['admin@example.com', 'billing@example.com'],
              createdBy: user.id,
              createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              lastSentAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              nextScheduledAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
              active: true
            }
          ];
          
          setReports(sampleReports);
          
          // Save to localStorage
          localStorage.setItem(`scheduled_reports_${user.id}`, JSON.stringify(sampleReports));
        } else {
          setReports([]);
        }
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
      setError('Failed to load scheduled reports');
    } finally {
      setLoading(false);
    }
  };
  
  // Create report
  const handleCreateReport = async () => {
    if (!user) return;
    
    try {
      setFormSubmitting(true);
      setError(null);
      
      // Check permission
      const hasPermission = await checkReportPermission();
      if (!hasPermission) {
        setError('You do not have permission to schedule reports');
        return;
      }
      
      // Validate form
      if (!newReport.name.trim()) {
        setError('Report name is required');
        return;
      }
      
      if (newReport.metricIds.length === 0) {
        setError('Please select at least one metric');
        return;
      }
      
      if (!newReport.recipients.trim()) {
        setError('Please add at least one recipient email');
        return;
      }
      
      // Create new report object
      const now = new Date();
      let nextScheduledAt = new Date();
      
      // Calculate next scheduled time
      switch (newReport.frequency) {
        case 'daily':
          // Set to tomorrow
          nextScheduledAt.setDate(nextScheduledAt.getDate() + 1);
          nextScheduledAt.setHours(8, 0, 0, 0);
          break;
          
        case 'weekly':
          // Set to next occurrence of day of week
          const daysUntilNextDayOfWeek = (newReport.dayOfWeek + 7 - now.getDay()) % 7;
          nextScheduledAt.setDate(nextScheduledAt.getDate() + daysUntilNextDayOfWeek);
          nextScheduledAt.setHours(8, 0, 0, 0);
          break;
          
        case 'monthly':
          // Set to next occurrence of day of month
          nextScheduledAt.setDate(newReport.dayOfMonth);
          if (nextScheduledAt < now) {
            nextScheduledAt.setMonth(nextScheduledAt.getMonth() + 1);
          }
          nextScheduledAt.setHours(8, 0, 0, 0);
          break;
      }
      
      const report: ScheduledReport = {
        id: `report-${Date.now()}`,
        name: newReport.name.trim(),
        description: newReport.description.trim(),
        dashboardId,
        metricIds: newReport.metricIds,
        format: newReport.format,
        frequency: newReport.frequency,
        dayOfWeek: newReport.frequency === 'weekly' ? newReport.dayOfWeek : undefined,
        dayOfMonth: newReport.frequency === 'monthly' ? newReport.dayOfMonth : undefined,
        recipients: newReport.recipients.split(',').map(email => email.trim()).filter(Boolean),
        createdBy: user.id,
        createdAt: now,
        nextScheduledAt,
        active: true
      };
      
      // Update local state
      setReports(prevReports => [...prevReports, report]);
      
      // Save to localStorage
      const allReports = [...reports, report];
      localStorage.setItem(`scheduled_reports_${user.id}`, JSON.stringify(allReports));
      
      // Reset form
      setNewReport({
        name: '',
        description: '',
        metricIds: [],
        format: 'pdf',
        frequency: 'weekly',
        dayOfWeek: 1,
        dayOfMonth: 1,
        recipients: ''
      });
      
      // Close form
      setShowAddForm(false);
      
      // Notify parent
      if (onCreateReport) {
        onCreateReport(report);
      }
    } catch (error) {
      console.error('Failed to create report:', error);
      setError('Failed to create scheduled report');
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Delete report
  const handleDeleteReport = async (reportId: string) => {
    if (!user) return;
    
    try {
      // Check permission
      const hasPermission = await checkReportPermission();
      if (!hasPermission) {
        setError('You do not have permission to manage reports');
        return;
      }
      
      // Update local state
      setReports(prevReports => prevReports.filter(r => r.id !== reportId));
      
      // Save to localStorage
      const updatedReports = reports.filter(r => r.id !== reportId);
      localStorage.setItem(`scheduled_reports_${user.id}`, JSON.stringify(updatedReports));
      
      // Notify parent
      if (onDeleteReport) {
        onDeleteReport(reportId);
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      setError('Failed to delete scheduled report');
    }
  };
  
  // Toggle metric selection
  const toggleMetric = (metricId: string) => {
    setNewReport(prev => {
      const metricIds = [...prev.metricIds];
      const index = metricIds.indexOf(metricId);
      
      if (index >= 0) {
        metricIds.splice(index, 1);
      } else {
        metricIds.push(metricId);
      }
      
      return { ...prev, metricIds };
    });
  };
  
  // Format frequency
  const formatFrequency = (report: ScheduledReport): string => {
    switch (report.frequency) {
      case 'daily':
        return 'Daily at 8:00 AM';
        
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Weekly on ${days[report.dayOfWeek || 0]} at 8:00 AM`;
        
      case 'monthly':
        return `Monthly on day ${report.dayOfMonth} at 8:00 AM`;
        
      default:
        return report.frequency;
    }
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get file icon based on format
  const getFormatIcon = (format: 'pdf' | 'csv' | 'excel') => {
    switch (format) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'csv':
        return <FileText className="w-4 h-4" />;
      case 'excel':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };
  
  const isDarkTheme = theme === 'dark';
  
  return (
    <div className={`rounded-lg border ${
      isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        isDarkTheme ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className="font-medium">Scheduled Reports</h3>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center text-sm px-2 py-1 rounded-md ${
            isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Plus className="w-3 h-3 mr-1" />
          <span>New Report</span>
        </button>
      </div>
      
      <div className="p-4">
        {error && (
          <div className={`p-3 mb-4 rounded-md ${
            isDarkTheme ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
          }`}>
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Add Report Form */}
        {showAddForm && (
          <div className={`mb-6 p-4 rounded-md border ${
            isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h4 className="font-medium mb-4">Create Scheduled Report</h4>
            
            <div className="space-y-4">
              {/* Report Name */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Report Name *
                </label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full p-2 rounded-md border ${
                    isDarkTheme
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Weekly Performance Report"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full p-2 rounded-md border ${
                    isDarkTheme
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Report description..."
                  rows={2}
                />
              </div>
              
              {/* Format */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Report Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newReport.format === 'pdf'}
                      onChange={() => setNewReport(prev => ({ ...prev, format: 'pdf' }))}
                      className="mr-2"
                    />
                    <span className="text-sm">PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newReport.format === 'csv'}
                      onChange={() => setNewReport(prev => ({ ...prev, format: 'csv' }))}
                      className="mr-2"
                    />
                    <span className="text-sm">CSV</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newReport.format === 'excel'}
                      onChange={() => setNewReport(prev => ({ ...prev, format: 'excel' }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Excel</span>
                  </label>
                </div>
              </div>
              
              {/* Metrics */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Metrics to Include *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableMetrics.map(metric => (
                    <label key={metric.id} className={`flex items-center p-2 rounded border ${
                      isDarkTheme
                        ? 'border-gray-600 hover:bg-gray-600'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={newReport.metricIds.includes(metric.id)}
                        onChange={() => toggleMetric(metric.id)}
                        className="mr-2"
                      />
                      <span className="text-sm">{metric.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Frequency */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Frequency
                </label>
                <select
                  value={newReport.frequency}
                  onChange={(e) => setNewReport(prev => ({ 
                    ...prev, 
                    frequency: e.target.value as 'daily' | 'weekly' | 'monthly' 
                  }))}
                  className={`w-full p-2 rounded-md border ${
                    isDarkTheme
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              {/* Day of Week (for weekly) */}
              {newReport.frequency === 'weekly' && (
                <div>
                  <label className={`block mb-1 text-sm font-medium ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Day of Week
                  </label>
                  <select
                    value={newReport.dayOfWeek}
                    onChange={(e) => setNewReport(prev => ({ 
                      ...prev, 
                      dayOfWeek: parseInt(e.target.value) 
                    }))}
                    className={`w-full p-2 rounded-md border ${
                      isDarkTheme
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                  </select>
                </div>
              )}
              
              {/* Day of Month (for monthly) */}
              {newReport.frequency === 'monthly' && (
                <div>
                  <label className={`block mb-1 text-sm font-medium ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Day of Month
                  </label>
                  <select
                    value={newReport.dayOfMonth}
                    onChange={(e) => setNewReport(prev => ({ 
                      ...prev, 
                      dayOfMonth: parseInt(e.target.value) 
                    }))}
                    className={`w-full p-2 rounded-md border ${
                      isDarkTheme
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Recipients */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Recipients *
                </label>
                <textarea
                  value={newReport.recipients}
                  onChange={(e) => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                  className={`w-full p-2 rounded-md border ${
                    isDarkTheme
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="email@example.com, another@example.com"
                  rows={2}
                />
                <p className={`text-xs mt-1 ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Separate multiple emails with commas
                </p>
              </div>
              
              {/* Form Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`px-3 py-1 rounded-md ${
                    isDarkTheme
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReport}
                  disabled={formSubmitting}
                  className={`flex items-center px-3 py-1 rounded-md ${
                    isDarkTheme
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${formSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      <span>Create Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Reports List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className={`w-8 h-8 animate-spin ${
              isDarkTheme ? 'text-blue-400' : 'text-blue-500'
            }`} />
          </div>
        ) : reports.length === 0 ? (
          <div className={`text-center py-8 ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg mb-2">No scheduled reports</p>
            <p className="text-sm">
              Click "New Report" to create your first scheduled report
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div 
                key={report.id}
                className={`rounded-md border ${
                  isDarkTheme ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className={`p-4 ${
                  isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      {report.description && (
                        <p className={`text-sm mt-1 ${
                          isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {report.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {}}
                        className={`p-1 rounded hover:bg-opacity-10 hover:bg-black ${
                          isDarkTheme ? 'text-gray-300' : 'text-gray-500'
                        }`}
                        title="Edit report"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className={`p-1 rounded hover:bg-opacity-10 hover:bg-black ${
                          isDarkTheme ? 'text-red-400' : 'text-red-500'
                        }`}
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Format */}
                    <div className="flex items-center">
                      {getFormatIcon(report.format)}
                      <span className={`ml-2 text-sm ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {report.format.toUpperCase()} Report
                      </span>
                    </div>
                    
                    {/* Schedule */}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4" />
                      <span className={`ml-2 text-sm ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {formatFrequency(report)}
                      </span>
                    </div>
                    
                    {/* Recipients */}
                    <div className="flex items-center">
                      <Mail className="w-4 h-4" />
                      <span className={`ml-2 text-sm ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {/* Next Run */}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4" />
                      <span className={`ml-2 text-sm ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Next: {formatDate(report.nextScheduledAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Last Sent Info */}
                  {report.lastSentAt && (
                    <div className={`mt-3 pt-3 text-xs border-t ${
                      isDarkTheme ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
                    }`}>
                      Last sent on {formatDate(report.lastSentAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledReportsManager; 