import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Settings, 
  Info, 
  Eye, 
  EyeOff,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  FileText,
  Image as ImageIcon,
  Clock,
  Smartphone,
  Aperture,
  Zap,
  Hash,
  Globe
} from 'lucide-react';

interface MetadataItem {
  key: string;
  value: any;
  category: 'camera' | 'location' | 'datetime' | 'technical' | 'file' | 'other';
  sensitive?: boolean;
  formatted?: string;
}

interface EnterpriseMetadataPanelProps {
  metadata: Record<string, any>;
  fileName: string;
  fileSize: number;
  className?: string;
  onExport?: (format: 'json' | 'csv' | 'pdf') => void;
}

export const EnterpriseMetadataPanel: React.FC<EnterpriseMetadataPanelProps> = ({
  metadata,
  fileName,
  fileSize,
  className = '',
  onExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSensitive, setShowSensitive] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Categorize and format metadata
  const categorizedMetadata = useMemo(() => {
    const items: MetadataItem[] = [];
    
    Object.entries(metadata).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      
      let category: MetadataItem['category'] = 'other';
      let sensitive = false;
      let formatted = String(value);
      
      // Categorize based on key patterns
      if (key.toLowerCase().includes('gps') || key.toLowerCase().includes('location')) {
        category = 'location';
        sensitive = true;
      } else if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
        category = 'datetime';
        // Format dates
        if (value instanceof Date) {
          formatted = value.toLocaleString();
        } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
          formatted = new Date(value).toLocaleString();
        }
      } else if (key.toLowerCase().includes('camera') || key.toLowerCase().includes('make') || key.toLowerCase().includes('model')) {
        category = 'camera';
      } else if (key.toLowerCase().includes('iso') || key.toLowerCase().includes('aperture') || key.toLowerCase().includes('exposure') || key.toLowerCase().includes('focal')) {
        category = 'technical';
      } else if (key.toLowerCase().includes('file') || key.toLowerCase().includes('size') || key.toLowerCase().includes('format')) {
        category = 'file';
      }
      
      // Format specific values
      if (key.toLowerCase().includes('size') && typeof value === 'number') {
        formatted = formatFileSize(value);
      } else if (key.toLowerCase().includes('gps') && typeof value === 'number') {
        formatted = value.toFixed(6);
      }
      
      items.push({
        key,
        value,
        category,
        sensitive,
        formatted
      });
    });
    
    return items;
  }, [metadata]);

  // Filter metadata based on search and category
  const filteredMetadata = useMemo(() => {
    return categorizedMetadata.filter(item => {
      // Filter by search term
      if (searchTerm && !item.key.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !(item.formatted?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)) {
        return false;
      }
      
      // Filter by category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      // Filter sensitive data
      if (item.sensitive && !showSensitive) {
        return false;
      }
      
      return true;
    });
  }, [categorizedMetadata, searchTerm, selectedCategory, showSensitive]);

  // Group by category
  const groupedMetadata = useMemo(() => {
    const groups: Record<string, MetadataItem[]> = {};
    filteredMetadata.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredMetadata]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'camera': return <Camera className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'datetime': return <Calendar className="h-4 w-4" />;
      case 'technical': return <Settings className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'camera': return 'text-primary-400';
      case 'location': return 'text-security-red';
      case 'datetime': return 'text-accent-400';
      case 'technical': return 'text-security-blue';
      case 'file': return 'text-security-amber';
      default: return 'text-secondary-400';
    }
  };

  const categories = [
    { id: 'all', label: 'All Data', icon: <Hash className="h-4 w-4" /> },
    { id: 'camera', label: 'Camera', icon: <Camera className="h-4 w-4" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="h-4 w-4" /> },
    { id: 'datetime', label: 'Date & Time', icon: <Clock className="h-4 w-4" /> },
    { id: 'technical', label: 'Technical', icon: <Aperture className="h-4 w-4" /> },
    { id: 'file', label: 'File Info', icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className={`bg-enterprise-light border border-enterprise-accent rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-enterprise-accent bg-enterprise-lighter">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Metadata Analysis</h3>
              <p className="text-sm text-secondary-400">{fileName}</p>
            </div>
          </div>
          
          {/* Export Options */}
          {onExport && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onExport('json')}
                className="btn btn-sm btn-secondary"
                title="Export as JSON"
              >
                <Download className="h-4 w-4 mr-1" />
                JSON
              </button>
              <button
                onClick={() => onExport('csv')}
                className="btn btn-sm btn-secondary"
                title="Export as CSV"
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </button>
              <button
                onClick={() => onExport('pdf')}
                className="btn btn-sm btn-primary"
                title="Export as PDF"
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search metadata..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-enterprise-accent text-secondary-300 hover:bg-enterprise-accent/80'
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSensitive(!showSensitive)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showSensitive
                    ? 'bg-security-red/20 text-security-red border border-security-red/30'
                    : 'bg-enterprise-accent text-secondary-300 hover:bg-enterprise-accent/80'
                }`}
              >
                {showSensitive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>{showSensitive ? 'Hide' : 'Show'} Sensitive Data</span>
              </button>
            </div>
            
            <div className="text-sm text-secondary-400">
              {filteredMetadata.length} of {categorizedMetadata.length} fields
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {Object.keys(groupedMetadata).length === 0 ? (
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-400">No metadata found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMetadata).map(([category, items]) => (
              <div key={category} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center space-x-2 pb-2 border-b border-enterprise-accent/50">
                  <div className={getCategoryColor(category)}>
                    {getCategoryIcon(category)}
                  </div>
                  <h4 className="font-medium text-white capitalize">
                    {category === 'datetime' ? 'Date & Time' : category}
                  </h4>
                  <span className="text-xs text-secondary-400 bg-enterprise-accent px-2 py-1 rounded-full">
                    {items.length}
                  </span>
                </div>

                {/* Metadata Items */}
                <div className="grid gap-3">
                  {items.map((item, index) => (
                    <div
                      key={`${item.key}-${index}`}
                      className="flex items-center justify-between p-3 bg-enterprise-darker rounded-lg hover:bg-enterprise-accent/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-white truncate">
                            {item.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          {item.sensitive && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-security-red/20 text-security-red">
                              <Eye className="h-3 w-3 mr-1" />
                              Sensitive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-secondary-300 break-all">
                          {item.formatted || String(item.value)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(item.formatted || String(item.value), item.key)}
                        className="ml-3 p-2 opacity-0 group-hover:opacity-100 hover:bg-enterprise-light rounded-lg transition-all"
                        title="Copy value"
                      >
                        {copiedKey === item.key ? (
                          <Check className="h-4 w-4 text-security-green" />
                        ) : (
                          <Copy className="h-4 w-4 text-secondary-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-enterprise-accent bg-enterprise-darker">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">{categorizedMetadata.length}</div>
            <div className="text-xs text-secondary-400">Total Fields</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {categorizedMetadata.filter(item => item.sensitive).length}
            </div>
            <div className="text-xs text-secondary-400">Sensitive</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{formatFileSize(fileSize)}</div>
            <div className="text-xs text-secondary-400">File Size</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 