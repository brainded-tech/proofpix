// components/BulkProgressSummary.js - Overall progress for bulk operations
import React, { memo, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';

const BulkProgressSummary = memo(({ 
  files, 
  onPauseAll, 
  onResumeAll, 
  onClearCompleted,
  onExportAll,
  isPaused = false 
}) => {
  const stats = useMemo(() => {
    const total = files.length;
    const completed = files.filter(f => f.status === 'completed').length;
    const processing = files.filter(f => f.status === 'processing').length;
    const errors = files.filter(f => f.status === 'error').length;
    const pending = files.filter(f => f.status === 'pending').length;
    
    const overallProgress = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      total,
      completed,
      processing,
      errors,
      pending,
      overallProgress
    };
  }, [files]);

  if (stats.total === 0) return null;

  return (
    <div className="bulk-progress-summary">
      <div className="progress-header">
        <h3>Bulk Processing Progress</h3>
        <div className="progress-stats">
          <span>{stats.completed}/{stats.total} completed</span>
          {stats.errors > 0 && (
            <span className="error-count">• {stats.errors} errors</span>
          )}
        </div>
      </div>

      <div className="overall-progress">
        <div className="progress-bar large">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.overallProgress}%` }}
          />
        </div>
        <span className="progress-percentage">
          {Math.round(stats.overallProgress)}%
        </span>
      </div>

      <div className="progress-breakdown">
        <div className="stat-item completed">
          <LucideIcons.CheckCircle size={16} />
          <span>{stats.completed} Completed</span>
        </div>
        
        {stats.processing > 0 && (
          <div className="stat-item processing">
            <div className="mini-spinner" />
            <span>{stats.processing} Processing</span>
          </div>
        )}
        
        {stats.pending > 0 && (
          <div className="stat-item pending">
            <LucideIcons.Clock size={16} />
            <span>{stats.pending} Pending</span>
          </div>
        )}
        
        {stats.errors > 0 && (
          <div className="stat-item errors">
            <LucideIcons.AlertCircle size={16} />
            <span>{stats.errors} Errors</span>
          </div>
        )}
      </div>

      <div className="bulk-actions">
        {stats.processing > 0 && (
          <>
            {isPaused ? (
              <button onClick={onResumeAll} className="bulk-action-btn resume">
                <LucideIcons.Play size={16} />
                Resume All
              </button>
            ) : (
              <button onClick={onPauseAll} className="bulk-action-btn pause">
                <LucideIcons.Pause size={16} />
                Pause All
              </button>
            )}
          </>
        )}
        
        {stats.completed > 0 && (
          <>
            <button onClick={onExportAll} className="bulk-action-btn export">
              <LucideIcons.Download size={16} />
              Export All Data
            </button>
            
            <button onClick={onClearCompleted} className="bulk-action-btn clear">
              <LucideIcons.Trash2 size={16} />
              Clear Completed
            </button>
          </>
        )}
      </div>
    </div>
  );
});

BulkProgressSummary.displayName = 'BulkProgressSummary';
export default BulkProgressSummary;