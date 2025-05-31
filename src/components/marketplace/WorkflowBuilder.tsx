/**
 * Workflow Builder Component - Priority 14
 * Visual workflow builder with drag-and-drop functionality
 */

import React, { useState, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Settings, 
  Copy,
  Zap,
  GitBranch,
  Clock,
  Database,
  Mail,
  FileText,
  Code,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Eye,
  Edit3
} from 'lucide-react';
import { enterpriseMarketplaceService, WorkflowTemplate, WorkflowStep, WorkflowTrigger, WorkflowAction } from '../../services/enterpriseMarketplaceService';

interface WorkflowBuilderProps {
  template?: WorkflowTemplate;
  onSave?: (workflow: WorkflowTemplate) => void;
  onClose?: () => void;
}

interface DraggedNode {
  type: 'step' | 'trigger' | 'action';
  data: any;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  template,
  onSave,
  onClose
}) => {
  const [workflow, setWorkflow] = useState<Partial<WorkflowTemplate>>(template || {
    name: 'New Workflow',
    description: '',
    category: 'custom',
    industry: [],
    complexity: 'simple',
    estimatedTime: '5 minutes',
    steps: [],
    triggers: [],
    conditions: [],
    actions: [],
    variables: [],
    permissions: [],
    tags: []
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Available node types
  const nodeTypes = {
    triggers: [
      { id: 'file-upload', name: 'File Upload', icon: Upload, description: 'Triggered when files are uploaded' },
      { id: 'schedule', name: 'Schedule', icon: Clock, description: 'Time-based trigger' },
      { id: 'webhook', name: 'Webhook', icon: Code, description: 'HTTP webhook trigger' },
      { id: 'api-call', name: 'API Call', icon: Zap, description: 'External API trigger' }
    ],
    actions: [
      { id: 'process-document', name: 'Process Document', icon: FileText, description: 'Analyze and extract data' },
      { id: 'send-notification', name: 'Send Notification', icon: Mail, description: 'Send email or message' },
      { id: 'update-database', name: 'Update Database', icon: Database, description: 'Store or update data' },
      { id: 'call-api', name: 'Call API', icon: Code, description: 'Make external API call' },
      { id: 'generate-report', name: 'Generate Report', icon: FileText, description: 'Create summary report' }
    ],
    conditions: [
      { id: 'if-condition', name: 'If Condition', icon: GitBranch, description: 'Conditional branching' },
      { id: 'loop', name: 'Loop', icon: RotateCcw, description: 'Repeat actions' },
      { id: 'delay', name: 'Delay', icon: Clock, description: 'Wait before continuing' }
    ]
  };

  const handleDragStart = (nodeType: string, nodeData: any) => {
    setDraggedNode({ type: nodeType as any, data: nodeData });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      name: draggedNode.data.name,
      type: draggedNode.data.id.includes('condition') || draggedNode.data.id.includes('loop') || draggedNode.data.id.includes('delay') ? 'condition' : 'action',
      config: { type: draggedNode.data.id },
      position: { x, y },
      connections: { input: [], output: [] },
      errorHandling: { onError: 'stop' }
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));

    setDraggedNode(null);
  };

  const handleNodeClick = (stepId: string) => {
    setSelectedNode(stepId);
  };

  const handleNodeDelete = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.filter(step => step.id !== stepId) || []
    }));
    if (selectedNode === stepId) {
      setSelectedNode(null);
    }
  };

  const handleNodeUpdate = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      ) || []
    }));
  };

  const handleSave = async () => {
    try {
      const savedWorkflow = await enterpriseMarketplaceService.createCustomWorkflow(workflow);
      onSave?.(savedWorkflow);
    } catch (error) {
      console.error('Failed to save workflow:', error);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    // Simulate workflow execution
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const getNodeIcon = (stepType: string) => {
    const allNodes = [...nodeTypes.triggers, ...nodeTypes.actions, ...nodeTypes.conditions];
    const node = allNodes.find(n => n.id === stepType);
    return node?.icon || Zap;
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={workflow.name || ''}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
              className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-gray-900 dark:text-white"
              aria-label="Workflow Name"
              data-testid="workflow-name-input"
            />
            <select
              value={workflow.category || 'custom'}
              onChange={(e) => setWorkflow(prev => ({ ...prev, category: e.target.value as any }))}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-label="Workflow Category"
              data-testid="workflow-category-select"
            >
              <option value="custom">Custom</option>
              <option value="document-processing">Document Processing</option>
              <option value="compliance">Compliance</option>
              <option value="analytics">Analytics</option>
              <option value="integration">Integration</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              aria-label={isRunning ? 'Workflow is running' : 'Test run workflow'}
              data-testid="test-run-button"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isRunning ? 'Running...' : 'Test Run'}</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              aria-label="Save workflow"
              data-testid="save-button"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close workflow builder"
                data-testid="close-button"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Node Palette */}
        <aside 
          className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"
          role="complementary"
          aria-label="Workflow components palette"
          data-testid="components-sidebar"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Components</h3>

          {/* Triggers */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Triggers</h4>
            <div className="space-y-2" role="group" aria-label="Trigger components">
              {nodeTypes.triggers.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <div
                    key={trigger.id}
                    draggable
                    onDragStart={() => handleDragStart('trigger', trigger)}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    role="button"
                    tabIndex={0}
                    aria-label={`Drag ${trigger.name} trigger: ${trigger.description}`}
                    data-testid={`trigger-${trigger.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{trigger.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{trigger.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actions</h4>
            <div className="space-y-2" role="group" aria-label="Action components">
              {nodeTypes.actions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.id}
                    draggable
                    onDragStart={() => handleDragStart('action', action)}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    role="button"
                    tabIndex={0}
                    aria-label={`Drag ${action.name} action: ${action.description}`}
                    data-testid={`action-${action.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{action.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conditions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logic</h4>
            <div className="space-y-2" role="group" aria-label="Logic components">
              {nodeTypes.conditions.map((condition) => {
                const Icon = condition.icon;
                return (
                  <div
                    key={condition.id}
                    draggable
                    onDragStart={() => handleDragStart('condition', condition)}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    role="button"
                    tabIndex={0}
                    aria-label={`Drag ${condition.name} condition: ${condition.description}`}
                    data-testid={`condition-${condition.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{condition.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{condition.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <main 
          className="flex-1 relative"
          role="main"
          aria-label="Workflow canvas"
        >
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-100 dark:bg-gray-800 relative overflow-auto"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
            role="application"
            aria-label="Workflow design canvas - drag components here to build your workflow"
            data-testid="workflow-canvas"
          >
            {/* Empty state */}
            {(!workflow.steps || workflow.steps.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Start Building Your Workflow
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                    Drag components from the sidebar to create your workflow. Connect them to define the flow of your automation.
                  </p>
                </div>
              </div>
            )}

            {/* Workflow Steps */}
            {workflow.steps?.map((step) => {
              const Icon = getNodeIcon(step.config?.type || step.type);
              const isSelected = selectedNode === step.id;
              
              return (
                <div
                  key={step.id}
                  className={`absolute bg-white dark:bg-gray-700 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  style={{
                    left: step.position.x,
                    top: step.position.y,
                    width: '200px'
                  }}
                  onClick={() => handleNodeClick(step.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Workflow step: ${step.name}. Click to configure.`}
                  aria-selected={isSelected}
                  data-testid={`workflow-step-${step.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {step.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeDelete(step.id);
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label={`Delete ${step.name} step`}
                      data-testid={`delete-step-${step.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {step.config?.type || step.type}
                  </div>
                  
                  {/* Connection points */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Properties Panel */}
        {selectedNode && (
          <aside 
            className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"
            role="complementary"
            aria-label="Node properties panel"
            data-testid="properties-panel"
          >
            <NodePropertiesPanel
              step={workflow.steps?.find(s => s.id === selectedNode)}
              onUpdate={(updates) => handleNodeUpdate(selectedNode, updates)}
            />
          </aside>
        )}
      </div>

      {/* Bottom Panel - Workflow Settings */}
      <div 
        className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4"
        role="region"
        aria-label="Workflow settings"
        data-testid="workflow-settings"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label 
              htmlFor="workflow-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <input
              id="workflow-description"
              type="text"
              value={workflow.description || ''}
              onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Workflow description..."
              aria-describedby="workflow-description-help"
              data-testid="workflow-description-input"
            />
            <div id="workflow-description-help" className="sr-only">
              Enter a brief description of what this workflow does
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="workflow-complexity"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Complexity
            </label>
            <select
              id="workflow-complexity"
              value={workflow.complexity || 'simple'}
              onChange={(e) => setWorkflow(prev => ({ ...prev, complexity: e.target.value as any }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-describedby="workflow-complexity-help"
              data-testid="workflow-complexity-select"
            >
              <option value="simple">Simple</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <div id="workflow-complexity-help" className="sr-only">
              Select the complexity level of this workflow
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="workflow-time"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Estimated Time
            </label>
            <input
              id="workflow-time"
              type="text"
              value={workflow.estimatedTime || ''}
              onChange={(e) => setWorkflow(prev => ({ ...prev, estimatedTime: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., 5 minutes"
              aria-describedby="workflow-time-help"
              data-testid="workflow-time-input"
            />
            <div id="workflow-time-help" className="sr-only">
              Enter the estimated time this workflow takes to complete
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="workflow-tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tags
            </label>
            <input
              id="workflow-tags"
              type="text"
              value={workflow.tags?.join(', ') || ''}
              onChange={(e) => setWorkflow(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="automation, finance, etc."
              aria-describedby="workflow-tags-help"
              data-testid="workflow-tags-input"
            />
            <div id="workflow-tags-help" className="sr-only">
              Enter comma-separated tags to categorize this workflow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Node Properties Panel Component
interface NodePropertiesPanelProps {
  step?: WorkflowStep;
  onUpdate: (updates: Partial<WorkflowStep>) => void;
}

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({ step, onUpdate }) => {
  if (!step) return null;

  return (
    <div className="space-y-4" role="form" aria-label="Node configuration">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Node Properties</h3>
      </div>

      <div>
        <label 
          htmlFor="node-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Name
        </label>
        <input
          id="node-name"
          type="text"
          value={step.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          aria-describedby="node-name-help"
          data-testid="node-name-input"
        />
        <div id="node-name-help" className="sr-only">
          Enter a descriptive name for this workflow step
        </div>
      </div>

      <div>
        <label 
          htmlFor="node-type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Type
        </label>
        <select
          id="node-type"
          value={step.type}
          onChange={(e) => onUpdate({ type: e.target.value as any })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          aria-describedby="node-type-help"
          data-testid="node-type-select"
        >
          <option value="action">Action</option>
          <option value="condition">Condition</option>
          <option value="loop">Loop</option>
          <option value="parallel">Parallel</option>
          <option value="delay">Delay</option>
        </select>
        <div id="node-type-help" className="sr-only">
          Select the type of this workflow step
        </div>
      </div>

      <div>
        <label 
          htmlFor="node-error-handling"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Error Handling
        </label>
        <select
          id="node-error-handling"
          value={step.errorHandling.onError}
          onChange={(e) => onUpdate({ 
            errorHandling: { 
              ...step.errorHandling, 
              onError: e.target.value as any 
            } 
          })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          aria-describedby="node-error-handling-help"
          data-testid="node-error-handling-select"
        >
          <option value="stop">Stop on Error</option>
          <option value="continue">Continue on Error</option>
          <option value="retry">Retry on Error</option>
        </select>
        <div id="node-error-handling-help" className="sr-only">
          Select how this workflow step should handle errors
        </div>
      </div>

      {step.errorHandling.onError === 'retry' && (
        <div>
          <label 
            htmlFor="node-retry-count"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Retry Count
          </label>
          <input
            id="node-retry-count"
            type="number"
            value={step.errorHandling.retryCount || 3}
            onChange={(e) => onUpdate({ 
              errorHandling: { 
                ...step.errorHandling, 
                retryCount: parseInt(e.target.value) 
              } 
            })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="10"
            aria-describedby="node-retry-count-help"
            data-testid="node-retry-count-input"
          />
          <div id="node-retry-count-help" className="sr-only">
            Enter the number of times to retry this workflow step on error
          </div>
        </div>
      )}

      {/* Configuration based on step type */}
      <div>
        <label 
          htmlFor="node-configuration"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Configuration
        </label>
        <textarea
          id="node-configuration"
          value={JSON.stringify(step.config, null, 2)}
          onChange={(e) => {
            try {
              const config = JSON.parse(e.target.value);
              onUpdate({ config });
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
          rows={6}
          aria-describedby="node-configuration-help"
          data-testid="node-configuration-textarea"
        />
        <div id="node-configuration-help" className="sr-only">
          Enter the configuration for this workflow step
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder; 