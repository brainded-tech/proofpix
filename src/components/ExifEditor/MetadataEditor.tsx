import React, { useState } from 'react';
import { Edit3, Save, X, RotateCcw, Download, CheckSquare, Square } from 'lucide-react';

interface MetadataEditorProps {
  metadata: any;
  onSave: (modifiedMetadata: any, removedFields: string[]) => void;
  onCancel: () => void;
  onExport: (modifiedMetadata: any, removedFields: string[]) => void;
}

export const MetadataEditor: React.FC<MetadataEditorProps> = ({ metadata, onSave, onCancel, onExport }) => {
  const [editedMetadata, setEditedMetadata] = useState({ ...metadata });
  const [removedFields, setRemovedFields] = useState<Set<string>>(new Set());

  const handleFieldChange = (fieldKey: string, newValue: any) => {
    setEditedMetadata((prev: any) => ({ ...prev, [fieldKey]: newValue }));
  };

  const handleFieldToggle = (fieldKey: string) => {
    setRemovedFields((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldKey)) {
        newSet.delete(fieldKey);
      } else {
        newSet.add(fieldKey);
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setEditedMetadata({ ...metadata });
    setRemovedFields(new Set());
  };

  const hasChanges = JSON.stringify(editedMetadata) !== JSON.stringify(metadata) || removedFields.size > 0;

  const editableFields = [
    { key: 'dateTime', label: 'Date Taken', type: 'datetime-local' },
    { key: 'make', label: 'Camera Make', type: 'text' },
    { key: 'model', label: 'Camera Model', type: 'text' },
    { key: 'lens', label: 'Lens', type: 'text' },
    { key: 'software', label: 'Software', type: 'text' },
    { key: 'exposureTime', label: 'Exposure Time', type: 'text' },
    { key: 'fNumber', label: 'F-Number', type: 'number' },
    { key: 'iso', label: 'ISO', type: 'number' },
    { key: 'focalLength', label: 'Focal Length', type: 'text' },
    { key: 'gpsLatitude', label: 'Latitude', type: 'number', sensitive: true },
    { key: 'gpsLongitude', label: 'Longitude', type: 'number', sensitive: true },
    { key: 'gpsAltitude', label: 'Altitude', type: 'number', sensitive: true },
  ];

  return (
    <div className="metadata-editor bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Edit3 size={20} className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">Metadata Editor</h2>
          {hasChanges && <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Modified</span>}
        </div>
        <button onClick={handleReset} className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors" disabled={!hasChanges}>
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => ['gpsLatitude', 'gpsLongitude', 'gpsAltitude'].forEach(field => setRemovedFields((prev: Set<string>) => new Set([...Array.from(prev), field])))}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Remove GPS Data
          </button>
          <button
            onClick={() => ['make', 'model', 'software'].forEach(field => setRemovedFields((prev: Set<string>) => new Set([...Array.from(prev), field])))}
            className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
          >
            Remove Device Info
          </button>
          <button
            onClick={() => setRemovedFields(new Set())}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            Keep All Fields
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {editableFields.map(field => {
          const value = editedMetadata[field.key];
          const isRemoved = removedFields.has(field.key);
          
          if (value === undefined) return null;

          return (
            <div key={field.key} className={`flex items-center justify-between p-3 rounded border ${
              isRemoved ? 'border-red-500/30 bg-red-900/20' : 
              field.sensitive ? 'border-yellow-500/30 bg-yellow-900/20' : 'border-gray-600 bg-gray-700/30'
            }`}>
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => handleFieldToggle(field.key)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title={isRemoved ? 'Include field' : 'Remove field'}
                >
                  {isRemoved ? <Square size={16} /> : <CheckSquare size={16} />}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400 min-w-[120px]">
                      {field.label}
                      {field.sensitive && <span className="ml-1 text-yellow-400" title="Privacy sensitive">⚠</span>}
                    </span>
                    <div className="flex-1 text-right">
                      {isRemoved ? (
                        <span className="text-sm text-gray-500 line-through">Removed</span>
                      ) : (
                        <input
                          type={field.type}
                          value={field.type === 'datetime-local' && value ? new Date(value).toISOString().slice(0, 16) : value || ''}
                          onChange={(e) => {
                            const newValue = field.type === 'datetime-local' && e.target.value 
                              ? new Date(e.target.value).toISOString() 
                              : field.type === 'number' 
                              ? parseFloat(e.target.value) || 0 
                              : e.target.value;
                            handleFieldChange(field.key, newValue);
                          }}
                          className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          step={field.type === 'number' ? 'any' : undefined}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-600">
        <div className="text-sm text-gray-400">
          {removedFields.size > 0 && <span>{removedFields.size} field(s) will be removed</span>}
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors flex items-center space-x-2">
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button onClick={() => onExport(editedMetadata, Array.from(removedFields))} disabled={!hasChanges} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button onClick={() => onSave(editedMetadata, Array.from(removedFields))} disabled={!hasChanges} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
