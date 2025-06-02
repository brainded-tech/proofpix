import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Settings, Save, Download, Upload, Share2, Copy, Trash2,
  Plus, Search, Filter, Grid, List, Eye, Edit, ChevronDown, ChevronRight,
  ArrowRight, ArrowDown, GitBranch, Zap, Brain, Mail, Bell, Database,
  FileText, Image, Users, Clock, CheckCircle, AlertCircle, XCircle,
  RotateCcw, FastForward, SkipForward, Layers, Target, Activity
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  category: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  position: { x: number; y: number };
  config: Record<string, any>;
  inputs: WorkflowConnection[];
  outputs: WorkflowConnection[];
  status?: 'idle' | 'running' | 'success' | 'error' | 'warning';
  executionTime?: number;
  errorMessage?: string;
}

interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort: string;
  targetPort: string;
  condition?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  thumbnail: string;
  usageCount: number;
  rating: number;
}

interface ActionBlock {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  inputs: { name: string; type: string; required: boolean }[];
  outputs: { name: string; type: string }[];
  configSchema: any;
}

export const VisualWorkflowBuilder: React.FC = () => {
  const [workflow, setWorkflow] = useState<{
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
    isRunning: boolean;
  }>({
    id: '1',
    name: 'Document Processing Workflow',
    description: 'Automated document analysis and approval workflow',
    nodes: [],
    connections: [],
    isRunning: false
  });

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<ActionBlock | null>(null);
  const [showBlockLibrary, setShowBlockLibrary] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDebugging, setIsDebugging] = useState(false);
  const [executionLog, setExecutionLog] = useState<any[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Action block library
  const actionBlocks: ActionBlock[] = [
    {
      id: 'ai-analyze',
      name: 'AI Analysis',
      description: 'Analyze documents with AI',
      category: 'AI',
      icon: Brain,
      color: 'purple',
      inputs: [
        { name: 'document', type: 'file', required: true },
        { name: 'analysis_type', type: 'select', required: true }
      ],
      outputs: [
        { name: 'results', type: 'object' },
        { name: 'confidence', type: 'number' }
      ],
      configSchema: {}
    },
    {
      id: 'approval-request',
      name: 'Approval Request',
      description: 'Send approval request to users',
      category: 'Approval',
      icon: Users,
      color: 'blue',
      inputs: [
        { name: 'document', type: 'file', required: true },
        { name: 'approvers', type: 'array', required: true }
      ],
      outputs: [
        { name: 'approved', type: 'boolean' },
        { name: 'comments', type: 'string' }
      ],
      configSchema: {}
    },
    {
      id: 'email-notification',
      name: 'Email Notification',
      description: 'Send email notifications',
      category: 'Notification',
      icon: Mail,
      color: 'green',
      inputs: [
        { name: 'recipients', type: 'array', required: true },
        { name: 'subject', type: 'string', required: true },
        { name: 'body', type: 'string', required: true }
      ],
      outputs: [
        { name: 'sent', type: 'boolean' }
      ],
      configSchema: {}
    },
    {
      id: 'database-save',
      name: 'Save to Database',
      description: 'Store data in database',
      category: 'Integration',
      icon: Database,
      color: 'orange',
      inputs: [
        { name: 'data', type: 'object', required: true },
        { name: 'table', type: 'string', required: true }
      ],
      outputs: [
        { name: 'id', type: 'string' },
        { name: 'success', type: 'boolean' }
      ],
      configSchema: {}
    },
    {
      id: 'condition-check',
      name: 'Condition',
      description: 'Check conditions and branch',
      category: 'Logic',
      icon: GitBranch,
      color: 'yellow',
      inputs: [
        { name: 'value', type: 'any', required: true },
        { name: 'condition', type: 'string', required: true }
      ],
      outputs: [
        { name: 'true', type: 'any' },
        { name: 'false', type: 'any' }
      ],
      configSchema: {}
    },
    {
      id: 'delay',
      name: 'Delay',
      description: 'Wait for specified time',
      category: 'Utility',
      icon: Clock,
      color: 'gray',
      inputs: [
        { name: 'duration', type: 'number', required: true }
      ],
      outputs: [
        { name: 'continue', type: 'any' }
      ],
      configSchema: {}
    }
  ];

  const categories = ['all', 'AI', 'Approval', 'Notification', 'Integration', 'Logic', 'Utility'];

  const filteredBlocks = actionBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (block: ActionBlock, e: React.DragEvent) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedBlock || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / zoom;
    const y = (e.clientY - rect.top - canvasOffset.y) / zoom;

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: 'action',
      category: draggedBlock.category,
      name: draggedBlock.name,
      description: draggedBlock.description,
      icon: draggedBlock.icon,
      position: { x, y },
      config: {},
      inputs: [],
      outputs: [],
      status: 'idle'
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));

    setDraggedBlock(null);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const executeWorkflow = async () => {
    setWorkflow(prev => ({ ...prev, isRunning: true }));
    setIsDebugging(true);
    setExecutionLog([]);

    // Simulate workflow execution
    for (const node of workflow.nodes) {
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === node.id ? { ...n, status: 'running' } : n
        )
      }));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const success = Math.random() > 0.1; // 90% success rate
      const status = success ? 'success' : 'error';
      const executionTime = Math.floor(Math.random() * 3000) + 500;

      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === node.id ? { 
            ...n, 
            status, 
            executionTime,
            errorMessage: !success ? 'Simulated error for demonstration' : undefined
          } : n
        )
      }));

      setExecutionLog(prev => [...prev, {
        nodeId: node.id,
        nodeName: node.name,
        status,
        executionTime,
        timestamp: new Date(),
        data: { input: 'Sample input', output: success ? 'Sample output' : null }
      }]);
    }

    setWorkflow(prev => ({ ...prev, isRunning: false }));
  };

  const BlockLibrary = () => (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Library Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Action Blocks</h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredBlocks.map(block => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(block, e)}
              className="p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-blue-500 cursor-grab active:cursor-grabbing transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-${block.color}-500/20 flex items-center justify-center`}>
                  <block.icon className={`w-4 h-4 text-${block.color}-400`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-100 text-sm">{block.name}</h4>
                  <p className="text-xs text-slate-400">{block.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const WorkflowCanvas = () => (
    <div className="flex-1 relative overflow-hidden bg-slate-900">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={executeWorkflow}
          disabled={workflow.isRunning || workflow.nodes.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {workflow.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {workflow.isRunning ? 'Running...' : 'Run Workflow'}
        </button>
        
        <button className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </button>
        
        <button className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className="bg-slate-700 hover:bg-slate-600 text-slate-100 w-8 h-8 rounded flex items-center justify-center"
        >
          -
        </button>
        <span className="text-slate-100 text-sm px-2">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          className="bg-slate-700 hover:bg-slate-600 text-slate-100 w-8 h-8 rounded flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative"
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Workflow Nodes */}
        {workflow.nodes.map(node => (
          <div
            key={node.id}
            className={`absolute w-48 bg-slate-800 border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedNode?.id === node.id ? 'border-blue-500' : 'border-slate-600'
            } ${
              node.status === 'running' ? 'ring-2 ring-blue-400 ring-opacity-50' :
              node.status === 'success' ? 'ring-2 ring-green-400 ring-opacity-50' :
              node.status === 'error' ? 'ring-2 ring-red-400 ring-opacity-50' :
              ''
            }`}
            style={{
              left: node.position.x,
              top: node.position.y
            }}
            onClick={() => setSelectedNode(node)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <node.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-100 text-sm">{node.name}</h4>
                <p className="text-xs text-slate-400">{node.category}</p>
              </div>
              {node.status && (
                <div className="w-3 h-3 rounded-full">
                  {node.status === 'running' && <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />}
                  {node.status === 'success' && <CheckCircle className="w-3 h-3 text-green-400" />}
                  {node.status === 'error' && <XCircle className="w-3 h-3 text-red-400" />}
                </div>
              )}
            </div>
            
            {node.executionTime && (
              <div className="text-xs text-slate-400">
                Executed in {node.executionTime}ms
              </div>
            )}
            
            {node.errorMessage && (
              <div className="text-xs text-red-400 mt-1">
                {node.errorMessage}
              </div>
            )}

            {/* Connection Points */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-600 rounded-full border-2 border-slate-800" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-600 rounded-full border-2 border-slate-800" />
          </div>
        ))}

        {/* Empty State */}
        {workflow.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Start Building Your Workflow
              </h3>
              <p className="text-slate-500 max-w-md">
                Drag action blocks from the library to create your automated workflow.
                Connect them together to define the flow of data and actions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DebugPanel = () => (
    <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Execution Log</h3>
          <button
            onClick={() => setExecutionLog([])}
            className="text-slate-400 hover:text-slate-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {executionLog.length === 0 ? (
          <div className="text-center text-slate-500 mt-8">
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <p>No execution data yet</p>
            <p className="text-sm">Run the workflow to see logs</p>
          </div>
        ) : (
          <div className="space-y-3">
            {executionLog.map((log, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-100 text-sm">{log.nodeName}</h4>
                  <div className="flex items-center gap-2">
                    {log.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {log.status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-xs text-slate-400">{log.executionTime}ms</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {log.timestamp.toLocaleTimeString()}
                </div>
                {log.data && (
                  <div className="mt-2 text-xs">
                    <div className="text-slate-400">Input: {JSON.stringify(log.data.input)}</div>
                    {log.data.output && (
                      <div className="text-slate-400">Output: {JSON.stringify(log.data.output)}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GitBranch className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-semibold">{workflow.name}</h1>
              <p className="text-sm text-slate-400">{workflow.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowBlockLibrary(!showBlockLibrary)}
              className="text-slate-400 hover:text-slate-100"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDebugging(!isDebugging)}
              className="text-slate-400 hover:text-slate-100"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-100">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {showBlockLibrary && <BlockLibrary />}
        <WorkflowCanvas />
        {isDebugging && <DebugPanel />}
      </div>
    </div>
  );
}; 