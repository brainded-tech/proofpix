import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestAuth } from '../auth/TestAuthProvider';
import { 
  User, 
  Settings, 
  FileImage, 
  BarChart3, 
  Shield, 
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  Upload,
  Eye,
  DollarSign,
  Zap,
  Activity,
  Bell,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Book,
  Brain,
  Layers,
  Grid3X3,
  List,
  Filter,
  Search,
  Plus,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Star,
  Target,
  Gauge,
  PieChart,
  LineChart,
  BarChart,
  Camera,
  MapPin,
  Timer,
  Sparkles
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'progress' | 'activity';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data?: any;
  isVisible: boolean;
  isExpanded?: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
  badge?: string;
}

export const EnhancedDashboard: React.FC = () => {
  const { user, logout } = useTestAuth();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'photos-analyzed',
      title: 'Photos Analyzed',
      type: 'metric',
      size: 'small',
      position: { x: 0, y: 0 },
      data: { value: 1247, change: '+12%', trend: 'up' },
      isVisible: true
    },
    {
      id: 'processing-speed',
      title: 'Avg Processing Speed',
      type: 'metric',
      size: 'small',
      position: { x: 1, y: 0 },
      data: { value: '1.8s', change: '-0.2s', trend: 'up' },
      isVisible: true
    },
    {
      id: 'accuracy-rate',
      title: 'Accuracy Rate',
      type: 'metric',
      size: 'small',
      position: { x: 2, y: 0 },
      data: { value: '99.7%', change: '+0.1%', trend: 'up' },
      isVisible: true
    },
    {
      id: 'storage-used',
      title: 'Storage Used',
      type: 'progress',
      size: 'small',
      position: { x: 3, y: 0 },
      data: { current: 2.4, total: 10, unit: 'GB' },
      isVisible: true
    },
    {
      id: 'weekly-activity',
      title: 'Weekly Activity',
      type: 'chart',
      size: 'medium',
      position: { x: 0, y: 1 },
      data: { chartType: 'line' },
      isVisible: true
    },
    {
      id: 'recent-uploads',
      title: 'Recent Uploads',
      type: 'list',
      size: 'medium',
      position: { x: 2, y: 1 },
      data: { items: [] },
      isVisible: true
    },
    {
      id: 'privacy-insights',
      title: 'Privacy Insights',
      type: 'activity',
      size: 'large',
      position: { x: 0, y: 2 },
      data: { insights: [] },
      isVisible: true
    }
  ]);

  const quickActions: QuickAction[] = [
    {
      id: 'upload-photo',
      title: 'Upload Photo',
      description: 'Analyze a new image',
      icon: <Upload className="w-6 h-6" />,
      action: () => navigate('/app'),
      color: 'from-blue-500 to-blue-600',
      badge: 'Popular'
    },
    {
      id: 'batch-process',
      title: 'Batch Process',
      description: 'Upload multiple images',
      icon: <Layers className="w-6 h-6" />,
      action: () => navigate('/batch-processing'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Detailed insights',
      icon: <BarChart3 className="w-6 h-6" />,
      action: () => navigate('/analytics'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'security-scan',
      title: 'Security Scan',
      description: 'Check privacy risks',
      icon: <Shield className="w-6 h-6" />,
      action: () => navigate('/security-dashboard'),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    ));
  };

  const expandWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isExpanded: !widget.isExpanded }
        : widget
    ));
  };

  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.isVisible) return null;

    const baseClasses = `bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 ${
      widget.isExpanded ? 'col-span-2 row-span-2' : ''
    }`;

    switch (widget.type) {
      case 'metric':
        return (
          <motion.div
            key={widget.id}
            variants={fadeInUp}
            className={baseClasses}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {widget.title}
              </h3>
              <button
                onClick={() => expandWidget(widget.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {widget.isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {widget.data?.value}
              </div>
              <div className={`flex items-center text-sm ${
                widget.data?.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  widget.data?.trend === 'down' ? 'rotate-180' : ''
                }`} />
                {widget.data?.change}
              </div>
            </div>
          </motion.div>
        );

      case 'progress':
        const percentage = (widget.data?.current / widget.data?.total) * 100;
        return (
          <motion.div
            key={widget.id}
            variants={fadeInUp}
            className={baseClasses}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {widget.title}
              </h3>
              <button
                onClick={() => expandWidget(widget.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {widget.data?.current} {widget.data?.unit}
                </span>
                <span className="text-sm text-slate-500">
                  of {widget.data?.total} {widget.data?.unit}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'chart':
        return (
          <motion.div
            key={widget.id}
            variants={fadeInUp}
            className={`${baseClasses} col-span-2`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {widget.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <LineChart className="w-4 h-4" />
                </button>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <BarChart className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-48 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
              <div className="text-slate-400 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </motion.div>
        );

      case 'list':
        return (
          <motion.div
            key={widget.id}
            variants={fadeInUp}
            className={`${baseClasses} col-span-2`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {widget.title}
              </h3>
              <Link 
                to="/app"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">
                      IMG_00{item}.jpg
                    </div>
                    <div className="text-sm text-slate-500">
                      Analyzed {item} hours ago
                    </div>
                  </div>
                  <div className="text-emerald-600 text-sm font-medium">
                    ✓ Complete
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  ProofPix
                </span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1 ml-8">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Customize */}
              <button
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`p-2 rounded-lg transition-colors ${
                  isCustomizing 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Professional Plan
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Here's what's happening with your photo analysis today
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:transform hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl mb-4 group-hover:shadow-lg transition-shadow`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
                {action.badge && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                    {action.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Customization Panel */}
        <AnimatePresence>
          {isCustomizing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Customize Dashboard
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {widgets.map((widget) => (
                  <label key={widget.id} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={widget.isVisible}
                      onChange={() => toggleWidget(widget.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {widget.title}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Widgets */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {widgets.map(renderWidget)}
        </motion.div>
      </div>
    </div>
  );
}; 