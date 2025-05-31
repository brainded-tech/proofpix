import React, { useState, useEffect } from 'react';
import { Shield, FileText, Clock, User, Hash, AlertTriangle, CheckCircle, Download, Search, Filter, RefreshCw, Eye, Lock, Gavel } from 'lucide-react';
import { chainOfCustody, ChainOfCustodyLog, CustodyEvent } from '../../utils/chainOfCustody';
import { errorHandler } from '../../utils/errorHandler';

interface ChainOfCustodyProps {
  fileId?: string;
  showAllFiles?: boolean;
  className?: string;
}

export const ChainOfCustody: React.FC<ChainOfCustodyProps> = ({
  fileId,
  showAllFiles = false,
  className = ''
}) => {
  const [custodyLogs, setCustodyLogs] = useState<ChainOfCustodyLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ChainOfCustodyLog | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustodyEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'integrity' | 'compliance'>('overview');

  useEffect(() => {
    loadCustodyData();
  }, [fileId, showAllFiles]);

  const loadCustodyData = async () => {
    try {
      setLoading(true);
      
      if (fileId) {
        // Load specific file's custody log
        const log = chainOfCustody.getCustodyLog(fileId);
        if (log) {
          setCustodyLogs([log]);
          setSelectedLog(log);
        } else {
          setCustodyLogs([]);
          setSelectedLog(null);
        }
      } else if (showAllFiles) {
        // Load all custody logs
        const allLogs = chainOfCustody.getAllCustodyLogs();
        setCustodyLogs(allLogs);
        if (allLogs.length > 0 && !selectedLog) {
          setSelectedLog(allLogs[0]);
        }
      }
    } catch (error) {
      await errorHandler.handleError('chain_of_custody_load', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIntegrity = async (logFileId: string) => {
    try {
      setVerifying(true);
      const isValid = await chainOfCustody.verifyIntegrity(logFileId);
      
      // Reload data to show updated verification
      await loadCustodyData();
      
      // Show result notification (you could add a toast notification here)
      console.log(`Integrity verification ${isValid ? 'passed' : 'failed'} for file ${logFileId}`);
    } catch (error) {
      await errorHandler.handleError('chain_of_custody_verify', error as Error);
    } finally {
      setVerifying(false);
    }
  };

  const handleExportReport = async (logFileId: string, format: 'json' | 'pdf' | 'xml') => {
    try {
      const report = await chainOfCustody.exportCustodyReport(logFileId, format);
      
      // Create download
      const blob = new Blob([report], { 
        type: format === 'json' ? 'application/json' : 
              format === 'xml' ? 'application/xml' : 'application/pdf' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `custody_report_${logFileId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      await errorHandler.handleError('chain_of_custody_export', error as Error);
    }
  };

  const filteredLogs = custodyLogs.filter(log => {
    const matchesSearch = log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.fileId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'compliant' && log.compliance.status === 'compliant') ||
                         (filterType === 'non-compliant' && log.compliance.status === 'non-compliant') ||
                         (filterType === 'high-score' && log.courtAdmissibility.score >= 90);
    
    return matchesSearch && matchesFilter;
  });

  const getIntegrityStatusColor = (log: ChainOfCustodyLog) => {
    if (!log.integrity.chainValid || !log.integrity.hashesValid) return 'text-red-500';
    if (log.courtAdmissibility.score >= 90) return 'text-green-500';
    if (log.courtAdmissibility.score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getEventTypeIcon = (eventType: CustodyEvent['eventType']) => {
    switch (eventType) {
      case 'upload': return <FileText className="w-4 h-4" />;
      case 'access': return <Eye className="w-4 h-4" />;
      case 'analysis': return <Search className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      case 'modification': return <AlertTriangle className="w-4 h-4" />;
      case 'transfer': return <RefreshCw className="w-4 h-4" />;
      case 'verification': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading chain of custody data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chain of Custody
            </h2>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Legal Evidence
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadCustodyData()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        {showAllFiles && (
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Files</option>
              <option value="compliant">Compliant</option>
              <option value="non-compliant">Non-Compliant</option>
              <option value="high-score">High Admissibility (90+)</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex h-[600px]">
        {/* File List (if showing all files) */}
        {showAllFiles && (
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Files ({filteredLogs.length})
              </h3>
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.fileId}
                    onClick={() => setSelectedLog(log)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedLog?.fileId === log.fileId
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {log.fileName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {log.fileId}
                        </p>
                      </div>
                      <div className={`ml-2 ${getIntegrityStatusColor(log)}`}>
                        {log.integrity.chainValid ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        {log.events.length} events
                      </span>
                      <span className={`font-medium ${getIntegrityStatusColor(log)}`}>
                        {log.courtAdmissibility.score}% admissible
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`${showAllFiles ? 'flex-1' : 'w-full'} flex flex-col`}>
          {selectedLog ? (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: Shield },
                    { id: 'events', label: 'Events', icon: Clock },
                    { id: 'integrity', label: 'Integrity', icon: Hash },
                    { id: 'compliance', label: 'Compliance', icon: Gavel }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* File Information */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        File Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">File Name</label>
                          <p className="text-gray-900 dark:text-white">{selectedLog.fileName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">File ID</label>
                          <p className="text-gray-900 dark:text-white font-mono text-sm">{selectedLog.fileId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Original Hash</label>
                          <p className="text-gray-900 dark:text-white font-mono text-sm break-all">{selectedLog.originalHash}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                          <p className="text-gray-900 dark:text-white">{selectedLog.createdAt.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Court Admissibility */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Court Admissibility Score
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">Admissibility</span>
                            <span className={`font-medium ${getIntegrityStatusColor(selectedLog)}`}>
                              {selectedLog.courtAdmissibility.score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedLog.courtAdmissibility.score >= 90 ? 'bg-green-500' :
                                selectedLog.courtAdmissibility.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${selectedLog.courtAdmissibility.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <Gavel className={`w-6 h-6 ${getIntegrityStatusColor(selectedLog)}`} />
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(selectedLog.courtAdmissibility.factors).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            {value ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-gray-600 dark:text-gray-300 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleVerifyIntegrity(selectedLog.fileId)}
                        disabled={verifying}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {verifying ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>Verify Integrity</span>
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExportReport(selectedLog.fileId, 'json')}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          <Download className="w-4 h-4" />
                          <span>JSON</span>
                        </button>
                        <button
                          onClick={() => handleExportReport(selectedLog.fileId, 'xml')}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          <Download className="w-4 h-4" />
                          <span>XML</span>
                        </button>
                        <button
                          onClick={() => handleExportReport(selectedLog.fileId, 'pdf')}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          <Download className="w-4 h-4" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Custody Events ({selectedLog.events.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedLog.events.map((event, index) => (
                        <div
                          key={event.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventDetails(true);
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${
                              event.eventType === 'upload' ? 'bg-blue-100 text-blue-600' :
                              event.eventType === 'verification' ? 'bg-green-100 text-green-600' :
                              event.eventType === 'modification' ? 'bg-red-100 text-red-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {getEventTypeIcon(event.eventType)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {event.action}
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {event.timestamp.toLocaleString()}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{event.user.name}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Hash className="w-3 h-3" />
                                  <span>{event.integrity.hashAlgorithm}</span>
                                </span>
                                {event.integrity.verified ? (
                                  <span className="flex items-center space-x-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Verified</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center space-x-1 text-red-600">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Unverified</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'integrity' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Integrity Status
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          {selectedLog.integrity.chainValid ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Chain Valid</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedLog.integrity.chainValid ? 'Intact' : 'Compromised'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {selectedLog.integrity.hashesValid ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Hashes Valid</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedLog.integrity.hashesValid ? 'Verified' : 'Mismatch'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                        <p>Last Verification: {selectedLog.integrity.lastVerification.toLocaleString()}</p>
                        <p>Verification Count: {selectedLog.integrity.verificationCount}</p>
                      </div>
                    </div>

                    {selectedLog.compliance.violations.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                          Integrity Violations
                        </h4>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          {selectedLog.compliance.violations.map((violation, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span>{violation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'compliance' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Compliance Status
                      </h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-full ${
                          selectedLog.compliance.status === 'compliant' ? 'bg-green-100 text-green-600' :
                          selectedLog.compliance.status === 'non-compliant' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {selectedLog.compliance.status === 'compliant' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {selectedLog.compliance.status.replace('-', ' ')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last Audit: {selectedLog.compliance.lastAudit.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Frameworks</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedLog.compliance.frameworks.map((framework) => (
                              <span
                                key={framework}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                              >
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Audit</label>
                            <p className="text-gray-900 dark:text-white">{selectedLog.compliance.nextAudit.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Violations</label>
                            <p className="text-gray-900 dark:text-white">{selectedLog.compliance.violations.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Chain of Custody Data
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {showAllFiles 
                    ? 'No files with chain of custody tracking found.'
                    : 'Select a file to view its chain of custody information.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Event Details
                </h3>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-500 dark:text-gray-400">Event ID</label>
                    <p className="text-gray-900 dark:text-white font-mono">{selectedEvent.id}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500 dark:text-gray-400">Timestamp</label>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.timestamp.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500 dark:text-gray-400">Event Type</label>
                    <p className="text-gray-900 dark:text-white capitalize">{selectedEvent.eventType}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500 dark:text-gray-400">User</label>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.user.name}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500 dark:text-gray-400">IP Address</label>
                    <p className="text-gray-900 dark:text-white font-mono">{selectedEvent.user.ipAddress}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500 dark:text-gray-400">Session ID</label>
                    <p className="text-gray-900 dark:text-white font-mono">{selectedEvent.metadata.sessionId}</p>
                  </div>
                </div>
                
                <div>
                  <label className="font-medium text-gray-500 dark:text-gray-400">Action</label>
                  <p className="text-gray-900 dark:text-white">{selectedEvent.action}</p>
                </div>
                
                <div>
                  <label className="font-medium text-gray-500 dark:text-gray-400">File Hash</label>
                  <p className="text-gray-900 dark:text-white font-mono text-xs break-all">
                    {selectedEvent.file.currentHash}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 