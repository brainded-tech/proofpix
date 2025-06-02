import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Brain, Zap, TrendingUp, AlertCircle, CheckCircle,
  Play, Pause, Settings, Download, Eye, BarChart3, Clock, DollarSign,
  Target, Layers, GitBranch, Activity, Cpu, Database, Cloud, Shield,
  Users, Calendar, Filter, Search, RefreshCw, ArrowRight, Info,
  ChevronRight, ChevronDown, Plus, X, Edit, Copy, Trash2
} from 'lucide-react';

interface TrainingProject {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'uploading' | 'processing' | 'training' | 'testing' | 'deployed' | 'failed';
  progress: number;
  accuracy: number;
  cost: number;
  estimatedCost: number;
  datasetSize: number;
  modelType: string;
  createdAt: Date;
  lastUpdated: Date;
  trainingTime: number; // in minutes
  deploymentUrl?: string;
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
  };
}

interface TrainingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'validated' | 'error';
  progress: number;
  errorMessage?: string;
  preview?: string;
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
  };
}

interface ModelVersion {
  id: string;
  version: string;
  accuracy: number;
  status: 'training' | 'testing' | 'deployed' | 'archived';
  createdAt: Date;
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
  };
  deploymentStats?: {
    requests: number;
    avgResponseTime: number;
    errorRate: number;
  };
}

export const CustomAITrainingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'configure' | 'monitor' | 'deploy'>('overview');
  const [projects, setProjects] = useState<TrainingProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<TrainingProject | null>(null);
  const [uploadFiles, setUploadFiles] = useState<TrainingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockProjects: TrainingProject[] = [
      {
        id: '1',
        name: 'Legal Document Classification',
        description: 'AI model to classify legal documents by type and urgency',
        status: 'training',
        progress: 67,
        accuracy: 94.2,
        cost: 1247.50,
        estimatedCost: 1800.00,
        datasetSize: 15420,
        modelType: 'Document Classification',
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date(),
        trainingTime: 340,
        metrics: {
          precision: 0.942,
          recall: 0.938,
          f1Score: 0.940,
          auc: 0.967
        }
      },
      {
        id: '2',
        name: 'Medical Image Analysis',
        description: 'Custom model for detecting anomalies in medical scans',
        status: 'deployed',
        progress: 100,
        accuracy: 97.8,
        cost: 3420.00,
        estimatedCost: 3420.00,
        datasetSize: 8750,
        modelType: 'Image Classification',
        createdAt: new Date('2024-01-10'),
        lastUpdated: new Date('2024-01-20'),
        trainingTime: 720,
        deploymentUrl: 'https://api.proofpix.com/models/medical-v1',
        metrics: {
          precision: 0.978,
          recall: 0.975,
          f1Score: 0.976,
          auc: 0.989
        }
      }
    ];
    setProjects(mockProjects);
    setSelectedProject(mockProjects[0]);
  }, []);

  const handleFileUpload = useCallback((files: FileList) => {
    setIsUploading(true);
    const newFiles: TrainingFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      metadata: {}
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setUploadFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            const newStatus = newProgress === 100 ? 'processing' : 'uploading';
            return { ...f, progress: newProgress, status: newStatus };
          }
          return f;
        }));
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setUploadFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'validated', progress: 100 } : f
        ));
      }, 3000);
    });

    setTimeout(() => setIsUploading(false), 3000);
  }, []);

  const ProjectOverview = () => (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-slate-100">{projects.length}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Training Cost</p>
              <p className="text-2xl font-bold text-slate-100">
                ${projects.reduce((sum, p) => sum + p.cost, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Accuracy</p>
              <p className="text-2xl font-bold text-slate-100">
                {(projects.reduce((sum, p) => sum + p.accuracy, 0) / projects.length).toFixed(1)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Models</p>
              <p className="text-2xl font-bold text-slate-100">
                {projects.filter(p => p.status === 'deployed').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Recent Projects</h3>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    project.status === 'deployed' ? 'bg-green-400' :
                    project.status === 'training' ? 'bg-blue-400' :
                    project.status === 'failed' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-100">{project.name}</h4>
                    <p className="text-sm text-slate-400">{project.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-slate-400">Accuracy</p>
                    <p className="font-semibold text-slate-100">{project.accuracy}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">Cost</p>
                    <p className="font-semibold text-slate-100">${project.cost.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">Status</p>
                    <p className="font-semibold text-slate-100 capitalize">{project.status}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TrainingDataUpload = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <div className="text-center">
          <div
            className="border-2 border-dashed border-slate-600 rounded-lg p-12 hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = 'image/*,.pdf,.doc,.docx';
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) handleFileUpload(files);
              };
              input.click();
            }}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Drop your training data here
            </h3>
            <p className="text-slate-400 mb-4">
              Support for images, PDFs, and documents. Up to 10GB per upload.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Choose Files
            </button>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100">Upload Progress</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {uploadFiles.map(file => (
                <div key={file.id} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-100">{file.name}</h4>
                      <span className="text-sm text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'validated' && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {file.status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                    {file.status === 'uploading' && <Clock className="w-5 h-5 text-blue-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Assessment */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100">Data Quality Assessment</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">Data Completeness</h4>
              <p className="text-2xl font-bold text-green-400">94%</p>
              <p className="text-sm text-slate-400">Excellent coverage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">Label Quality</h4>
              <p className="text-2xl font-bold text-blue-400">97%</p>
              <p className="text-sm text-slate-400">High consistency</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">Diversity Score</h4>
              <p className="text-2xl font-bold text-purple-400">89%</p>
              <p className="text-sm text-slate-400">Good variation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Brain className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-semibold">Custom AI Training</h1>
                <p className="text-sm text-slate-400">Enterprise AI Model Development</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-100">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-100">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'upload', label: 'Upload Data', icon: Upload },
              { id: 'configure', label: 'Configure Model', icon: Settings },
              { id: 'monitor', label: 'Training Monitor', icon: Activity },
              { id: 'deploy', label: 'Deploy & Test', icon: Cloud }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <ProjectOverview />}
            {activeTab === 'upload' && <TrainingDataUpload />}
            {activeTab === 'configure' && <div>Model Configuration Wizard (Coming Next)</div>}
            {activeTab === 'monitor' && <div>Training Progress Monitor (Coming Next)</div>}
            {activeTab === 'deploy' && <div>Deployment Dashboard (Coming Next)</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}; 