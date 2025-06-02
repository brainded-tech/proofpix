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
  Eye,
  Plus,
  ArrowRight
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

// Utility functions
const getStatusColor = (status: BatchJob['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-slate-600/20 text-slate-400 border border-slate-500/30';
    case 'running':
      return 'bg-blue-600/20 text-blue-400 border border-blue-500/30';
    case 'completed':
      return 'bg-green-600/20 text-green-400 border border-green-500/30';
    case 'failed':
      return 'bg-red-600/20 text-red-400 border border-red-500/30';
    case 'cancelled':
      return 'bg-gray-600/20 text-gray-400 border border-gray-500/30';
    case 'paused':
      return 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30';
    default:
      return 'bg-slate-600/20 text-slate-400 border border-slate-500/30';
  }
};

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
        return <Clock className="h-5 w-5" />;
      case 'running':
        return <Play className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5" />;
      case 'cancelled':
        return <Square className="h-5 w-5" />;
      case 'paused':
        return <Pause className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
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

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Modern Enterprise Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600/20 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
        <div>
                <h1 className="text-xl font-semibold text-white">Batch Processing</h1>
                <p className="text-xs text-slate-400">Manage bulk operations and workflows</p>
              </div>
        </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              autoRefresh
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-700 text-slate-300 border border-slate-600'
            }`}
          >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
              
          <button
            onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4 mr-2 inline" />
                New Batch Job
              </button>
              
              <button
                onClick={fetchData}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
          </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Queue Statistics */}
      {queueStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-slate-400 text-sm font-medium">Total Jobs</p>
                  <p className="text-2xl font-bold text-white mt-1">{queueStats.totalJobs}</p>
                </div>
                <div className="text-blue-400 bg-slate-700/50 p-3 rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                </div>
            </div>
          </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-slate-400 text-sm font-medium">Active Jobs</p>
                  <p className="text-2xl font-bold text-white mt-1">{queueStats.activeJobs}</p>
                </div>
                <div className="text-green-400 bg-slate-700/50 p-3 rounded-xl">
                  <Play className="h-6 w-6" />
                </div>
            </div>
          </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-slate-400 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-white mt-1">{queueStats.completedJobs}</p>
                </div>
                <div className="text-emerald-400 bg-slate-700/50 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
            </div>
          </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-slate-400 text-sm font-medium">Throughput</p>
                  <p className="text-2xl font-bold text-white mt-1">{queueStats.throughputPerHour}/hr</p>
                </div>
                <div className="text-purple-400 bg-slate-700/50 p-3 rounded-xl">
                  <Zap className="h-6 w-6" />
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                  placeholder="Search batch jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              </div>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Jobs</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="paused">Paused</option>
            </select>
        </div>
      </div>

      {/* Jobs List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Batch Jobs</h2>
              <span className="text-sm text-slate-400">
                {filteredJobs.length} jobs
              </span>
            </div>
                      </div>
          
          <div className="divide-y divide-slate-700">
            {isLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-slate-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 w-20 bg-slate-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No batch jobs found</p>
                <p className="text-sm">Create your first batch job to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Batch Job
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          job.status === 'running' ? 'bg-blue-600/20 text-blue-400' :
                          job.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                          job.status === 'failed' ? 'bg-red-600/20 text-red-400' :
                          job.status === 'paused' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-slate-600/20 text-slate-400'
                        }`}>
                      {getStatusIcon(job.status)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-medium truncate">{job.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                            {job.status.toUpperCase()}
                      </span>
                    </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-400">
                          <span>{job.type.replace('_', ' ').toUpperCase()}</span>
                          <span>{job.processedItems}/{job.totalItems} items</span>
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {job.status === 'running' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                              <span>Progress: {job.progress.toFixed(1)}%</span>
                              {job.estimatedTimeRemaining && (
                                <span>ETA: {formatDuration(job.estimatedTimeRemaining)}</span>
                              )}
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                        </div>
                      )}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {job.status === 'running' && (
                        <button
                          onClick={() => pauseJob(job.id)}
                          className="p-2 text-slate-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-slate-700"
                          title="Pause job"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      
                      {job.status === 'paused' && (
                        <button
                          onClick={() => resumeJob(job.id)}
                          className="p-2 text-slate-400 hover:text-green-400 transition-colors rounded-lg hover:bg-slate-700"
                          title="Resume job"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-700"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                        <button
                        onClick={() => cancelJob(job.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700"
                        title="Cancel job"
                      >
                        <Square className="h-4 w-4" />
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}

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
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600/20 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Job Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-400" />
              Job Information
            </h3>
            <div className="space-y-4">
          <div>
                <label className="text-sm font-medium text-slate-400">Name</label>
                <p className="text-white font-medium mt-1">{job.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Type</label>
                <p className="text-white font-medium mt-1">{job.type.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Status</label>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(job.status)}`}>
                  {job.status.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Progress</label>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-white font-medium">{job.progress.toFixed(1)}%</span>
                    <span className="text-slate-400">{job.processedItems}/{job.totalItems} items</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Created</label>
                <p className="text-white font-medium mt-1">{new Date(job.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-green-400" />
              Configuration
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <pre className="text-sm text-slate-300 overflow-auto max-h-48">
              {JSON.stringify(job.configuration, null, 2)}
            </pre>
            </div>
          </div>
        </div>

        {job.results && (
          <div className="mt-6 bg-slate-700/50 rounded-xl p-6 border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-emerald-400" />
              Results
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <pre className="text-sm text-slate-300 overflow-auto max-h-48">
              {JSON.stringify(job.results, null, 2)}
            </pre>
            </div>
          </div>
        )}

        {job.errorLog && (
          <div className="mt-6 bg-red-900/20 rounded-xl p-6 border border-red-800">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Log
            </h3>
            <div className="bg-red-950/50 rounded-lg p-4 border border-red-800">
              <p className="text-red-300 text-sm font-mono">{job.errorLog}</p>
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Create Batch Job</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Name
              </label>
              <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Enter job name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as BatchJob['type'])}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="bulk_upload">Bulk Upload</option>
                <option value="bulk_process">Bulk Process</option>
                <option value="bulk_export">Bulk Export</option>
                <option value="bulk_analysis">Bulk Analysis</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-300 hover:text-white transition-colors hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!jobName.trim() || isCreating}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Job'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 