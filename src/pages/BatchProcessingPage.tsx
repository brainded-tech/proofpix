import React from 'react';
import { ArrowLeft, Info, Zap, BarChart3, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BatchProcessingDashboard } from '../components/BatchProcessingDashboard';

export const BatchProcessingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Batch Processing</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage and monitor bulk operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">
                Advanced Batch Processing
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Process hundreds of images simultaneously with real-time monitoring, queue management, and automated workflows. 
                Perfect for insurance claims, legal evidence, and large-scale analysis projects.
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <Zap className="h-6 w-6 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Processing</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Monitor job progress in real-time with live updates, pause/resume capabilities, and estimated completion times.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Queue Management</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced queue management with priority settings, concurrency control, and intelligent resource allocation.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <Upload className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Operations</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Upload, process, analyze, and export hundreds of images with automated workflows and error handling.
            </p>
          </div>
        </div>

        {/* Main Dashboard */}
        <BatchProcessingDashboard />

        {/* Usage Instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How to Use Batch Processing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">1. Create Batch Job</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click "New Batch Job" to create a new bulk operation. Choose from upload, process, export, or analysis jobs.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">2. Configure Settings</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Set up your batch job with specific parameters like output format, analysis type, and processing options.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">3. Monitor Progress</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Watch real-time progress with detailed statistics, pause/resume jobs as needed, and handle any errors.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">4. Review Results</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access detailed results, download processed files, and review comprehensive job reports.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common Use Cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">🏢 Insurance Claims</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Process hundreds of claim photos simultaneously with automated metadata extraction and report generation.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">⚖️ Legal Evidence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bulk process evidence photos with chain of custody tracking and court-ready documentation.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">🏠 Real Estate</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate professional property reports for multiple listings with automated photo analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">Performance Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Optimize File Sizes</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Compress images before batch upload to reduce processing time and bandwidth usage.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Schedule Large Jobs</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Run large batch jobs during off-peak hours for optimal performance and resource allocation.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Monitor Queue Status</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Keep an eye on queue statistics to understand system load and plan your batch operations accordingly.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Use Appropriate Concurrency</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Adjust concurrency settings based on your subscription tier and system resources for optimal throughput.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 