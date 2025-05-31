import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Zap,
  BarChart3,
  Settings,
  Filter,
  Search,
  FileText,
  Trash2,
  Eye
} from 'lucide-react';
import { analytics } from '../utils/analytics';

interface BatchJob {
  id: string;
  name: string;
  type: 'bulk_upload' | 'bulk_process' | 'bulk_export' | 'bulk_analysis';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
  totalItems: number;
  processedItems: number;
  failedItems: number;
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedTimeRemaining?: number;
  configuration: any;
  results?: any;
  errorLog?: string;
}

interface QueueStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
  throughputPerHour: number;
}

export const BatchProcessingDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [selectedJob, setSelectedJob] = useState<BatchJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch batch jobs and queue statistics
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API calls - replace with actual API integration
      const mockJobs: BatchJob[] = [
        {
          id: 'batch-001',
          name: 'Insurance Claims Analysis',
          type: 'bulk_analysis',
          status: 'running',
          totalItems: 150,
          processedItems: 89,
          failedItems: 2,
          progress: 59.3,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          startedAt: new Date(Date.now() - 3000000).toISOString(),
          estimatedTimeRemaining: 1200,
          configuration: {
            analysisType: 'metadata_extraction',
            outputFormat: 'json',
            includeGPS: true,
            generateThumbnails: true
          }
        },
        {
          id: 'batch-002',
          name: 'Legal Evidence Processing',
          type: 'bulk_process',
          status: 'completed',
          totalItems: 75,
          processedItems: 75,
          failedItems: 0,
          progress: 100,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          startedAt: new Date(Date.now() - 6600000).toISOString(),
          completedAt: new Date(Date.now() - 1800000).toISOString(),
          configuration: {
            processType: 'chain_of_custody',
            compliance: ['FRE', 'FRCP'],
            encryption: true
          },
          results: {
            successRate: 100,
            averageProcessingTime: 45,
            totalDataProcessed: '2.3 GB'
          }
        },
        {
          id: 'batch-003',
          name: 'Real Estate Photo Export',
          type: 'bulk_export',
          status: 'pending',
          totalItems: 200,
          processedItems: 0,
          failedItems: 0,
          progress: 0,
          createdAt: new Date(Date.now() - 300000).toISOString(),
          configuration: {
            exportFormat: 'pdf',
            template: 'professional',
            includeMetadata: true,
            watermark: true
          }
        },
        {
          id: 'batch-004',
          name: 'Forensic Image Upload',
          type: 'bulk_upload',
          status: 'failed',
          totalItems: 50,
          processedItems: 23,
          failedItems: 27,
          progress: 46,
          createdAt: new Date(Date.now() - 5400000).toISOString(),
          startedAt: new Date(Date.now() - 5000000).toISOString(),
          configuration: {
            virusScan: true,
            chainOfCustody: true,
            autoAnalysis: true
          },
          errorLog: 'Multiple files failed virus scan validation'
        }
      ];

      const mockStats: QueueStats = {
        totalJobs: 156,
        activeJobs: 3,
        completedJobs: 142,
        failedJobs: 11,
        averageProcessingTime: 127,
        throughputPerHour: 45
      };

      setJobs(mockJobs);
      setQueueStats(mockStats);
      
      analytics.trackFeatureUsage('Batch Processing', 'Dashboard Viewed');
    } catch (error) {
      console.error('Failed to fetch batch processing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh data
  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh]);

  // Filter and search jobs
  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Job control functions
  const pauseJob = useCallback(async (jobId: string) => {
    try {
      // Simulate API call
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'paused' as const } : job
      ));
      analytics.trackFeatureUsage('Batch Processing', 'Job Paused');
    } catch (error) {
      console.error('Failed to pause job:', error);
    }
  }, []);

  const resumeJob = useCallback(async (jobId: string) => {
    try {
      // Simulate API call
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'running' as const } : job
      ));
      analytics.trackFeatureUsage('Batch Processing', 'Job Resumed');
    } catch (error) {
      console.error('Failed to resume job:', error);
    }
  }, []);

  const cancelJob = useCallback(async (jobId: string) => {
    try {
      // Simulate API call
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'cancelled' as const } : job
      ));
      analytics.trackFeatureUsage('Batch Processing', 'Job Cancelled');
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  }, []);

  const deleteJob = useCallback(async (jobId: string) => {
    try {
      // Simulate API call
      setJobs(prev => prev.filter(job => job.id !== jobId));
      analytics.trackFeatureUsage('Batch Processing', 'Job Deleted');
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  }, []);

  const getStatusIcon = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'running':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'paused':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading batch processing data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Batch Processing</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor bulk operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>New Batch Job</span>
          </button>
        </div>
      </div>

      {/* Queue Statistics */}
      {queueStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{queueStats.totalJobs}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{queueStats.activeJobs}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((queueStats.completedJobs / queueStats.totalJobs) * 100)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Throughput/Hour</p>
                <p className="text-2xl font-bold text-purple-600">{queueStats.throughputPerHour}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {job.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {job.type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(job.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {job.progress.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>{job.processedItems} / {job.totalItems}</div>
                    {job.failedItems > 0 && (
                      <div className="text-red-500 text-xs">{job.failedItems} failed</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      {job.startedAt && (
                        <div>
                          {job.completedAt 
                            ? formatDuration(Math.floor((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000))
                            : formatDuration(Math.floor((Date.now() - new Date(job.startedAt).getTime()) / 1000))
                          }
                        </div>
                      )}
                      {job.estimatedTimeRemaining && job.status === 'running' && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ~{formatDuration(job.estimatedTimeRemaining)} remaining
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {job.status === 'running' && (
                        <button
                          onClick={() => pauseJob(job.id)}
                          className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400"
                          title="Pause Job"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      {job.status === 'paused' && (
                        <button
                          onClick={() => resumeJob(job.id)}
                          className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                          title="Resume Job"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {(job.status === 'running' || job.status === 'paused' || job.status === 'pending') && (
                        <button
                          onClick={() => cancelJob(job.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          title="Cancel Job"
                        >
                          <Square className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') && (
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                          title="Delete Job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <CreateBatchJobModal 
          onClose={() => setShowCreateModal(false)}
          onJobCreated={(job) => {
            setJobs(prev => [job, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

// Job Details Modal Component
const JobDetailsModal: React.FC<{ job: BatchJob; onClose: () => void }> = ({ job, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-white">{job.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                <p className="text-gray-900 dark:text-white">{job.type.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <p className="text-gray-900 dark:text-white">{job.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</label>
                <p className="text-gray-900 dark:text-white">{job.progress.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(job.configuration, null, 2)}
            </pre>
          </div>
        </div>

        {job.results && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Results</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(job.results, null, 2)}
            </pre>
          </div>
        )}

        {job.errorLog && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Error Log</h3>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
              <p className="text-red-800 dark:text-red-300 text-sm">{job.errorLog}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Create Batch Job Modal Component
const CreateBatchJobModal: React.FC<{ 
  onClose: () => void; 
  onJobCreated: (job: BatchJob) => void; 
}> = ({ onClose, onJobCreated }) => {
  const [jobName, setJobName] = useState('');
  const [jobType, setJobType] = useState<BatchJob['type']>('bulk_upload');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!jobName.trim()) return;

    setIsCreating(true);
    try {
      // Simulate job creation
      const newJob: BatchJob = {
        id: `batch-${Date.now()}`,
        name: jobName,
        type: jobType,
        status: 'pending',
        totalItems: 0,
        processedItems: 0,
        failedItems: 0,
        progress: 0,
        createdAt: new Date().toISOString(),
        configuration: {}
      };

      onJobCreated(newJob);
      analytics.trackFeatureUsage('Batch Processing', 'Job Created');
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Batch Job</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Name
              </label>
              <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter job name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as BatchJob['type'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bulk_upload">Bulk Upload</option>
                <option value="bulk_process">Bulk Process</option>
                <option value="bulk_export">Bulk Export</option>
                <option value="bulk_analysis">Bulk Analysis</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!jobName.trim() || isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 