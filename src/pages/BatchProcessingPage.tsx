import React from 'react';
import { ArrowLeft, Info, Zap, BarChart3, Upload, Shield, Clock, CheckCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BatchProcessingDashboard } from '../components/BatchProcessingDashboard';

export const BatchProcessingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-slate-400 hover:text-white mr-4 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">Batch Processing</h1>
                <p className="text-sm text-slate-400">Manage and monitor bulk operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start">
            <div className="bg-blue-600/20 p-2 rounded-lg mr-4 flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Advanced Batch Processing
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Process hundreds of images simultaneously with real-time monitoring, queue management, and automated workflows. 
                Perfect for insurance claims, legal evidence, and large-scale analysis projects.
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-orange-600/20 p-3 rounded-xl mr-4">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Real-time Processing</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Monitor job progress in real-time with live updates, pause/resume capabilities, and estimated completion times.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600/20 p-3 rounded-xl mr-4">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Queue Management</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Advanced queue management with priority settings, concurrency control, and intelligent resource allocation.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-green-600/20 p-3 rounded-xl mr-4">
                <Upload className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Bulk Operations</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Upload, process, analyze, and export hundreds of images with automated workflows and error handling.
            </p>
          </div>
        </div>

        {/* Main Dashboard */}
        <BatchProcessingDashboard />

        {/* Usage Instructions */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center mb-6">
            <div className="bg-purple-600/20 p-2 rounded-lg mr-3">
              <Settings className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">How to Use Batch Processing</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600/20 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <div>
                  <h4 className="font-semibold text-white mb-2">Create Batch Job</h4>
                  <p className="text-slate-400 leading-relaxed">
                Click "New Batch Job" to create a new bulk operation. Choose from upload, process, export, or analysis jobs.
              </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-600/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Configure Settings</h4>
                  <p className="text-slate-400 leading-relaxed">
                Set up your batch job with specific parameters like output format, analysis type, and processing options.
              </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600/20 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <div>
                  <h4 className="font-semibold text-white mb-2">Monitor Progress</h4>
                  <p className="text-slate-400 leading-relaxed">
                Watch real-time progress with detailed statistics, pause/resume jobs as needed, and handle any errors.
              </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-600/20 text-orange-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Review Results</h4>
                  <p className="text-slate-400 leading-relaxed">
                Access detailed results, download processed files, and review comprehensive job reports.
              </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center mb-6">
            <div className="bg-emerald-600/20 p-2 rounded-lg mr-3">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Common Use Cases</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <div className="text-2xl mb-3">🏢</div>
              <h4 className="font-semibold text-white mb-3">Insurance Claims</h4>
              <p className="text-slate-400 leading-relaxed">
                Process hundreds of claim photos simultaneously with automated metadata extraction and report generation.
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <div className="text-2xl mb-3">⚖️</div>
              <h4 className="font-semibold text-white mb-3">Legal Evidence</h4>
              <p className="text-slate-400 leading-relaxed">
                Bulk process evidence photos with chain of custody tracking and court-ready documentation.
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <div className="text-2xl mb-3">🏠</div>
              <h4 className="font-semibold text-white mb-3">Real Estate</h4>
              <p className="text-slate-400 leading-relaxed">
                Generate professional property reports for multiple listings with automated photo analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="bg-cyan-600/20 p-2 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Performance Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/50">
              <h4 className="font-semibold text-white mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                Optimize File Sizes
              </h4>
              <p className="text-slate-300">
                Compress images before batch upload to reduce processing time and bandwidth usage.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/50">
              <h4 className="font-semibold text-white mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-green-400" />
                Schedule Large Jobs
              </h4>
              <p className="text-slate-300">
                Run large batch jobs during off-peak hours for optimal performance and resource allocation.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/50">
              <h4 className="font-semibold text-white mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-purple-400" />
                Monitor Queue Status
              </h4>
              <p className="text-slate-300">
                Keep an eye on queue statistics to understand system load and plan your batch operations accordingly.
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/50">
              <h4 className="font-semibold text-white mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-orange-400" />
                Use Appropriate Concurrency
              </h4>
              <p className="text-slate-300">
                Adjust concurrency settings based on your subscription tier and system resources for optimal throughput.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 