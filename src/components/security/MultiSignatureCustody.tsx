import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, Clock, AlertTriangle, UserPlus, X, Key, FileText } from 'lucide-react';
import { chainOfCustody } from '../../utils/chainOfCustody';
import { errorHandler } from '../../utils/errorHandler';

interface CustodySignature {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'investigator' | 'supervisor' | 'legal_counsel' | 'expert_witness' | 'chain_manager';
  signedAt?: Date;
  signature?: string;
  required: boolean;
  status: 'pending' | 'signed' | 'declined' | 'expired';
  comments?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

interface MultiSignatureRequest {
  id: string;
  fileId: string;
  fileName: string;
  requestedBy: string;
  requestedAt: Date;
  purpose: string;
  requiredSignatures: CustodySignature[];
  optionalSignatures: CustodySignature[];
  deadline?: Date;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  completedAt?: Date;
  threshold: number; // Minimum required signatures
}

interface MultiSignatureCustodyProps {
  fileId: string;
  className?: string;
}

export const MultiSignatureCustody: React.FC<MultiSignatureCustodyProps> = ({
  fileId,
  className = ''
}) => {
  const [signatureRequests, setSignatureRequests] = useState<MultiSignatureRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<MultiSignatureRequest | null>(null);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    purpose: '',
    deadline: '',
    threshold: 2,
    requiredSigners: [] as Array<{email: string, role: CustodySignature['role']}>
  });

  const currentUser = {
    id: localStorage.getItem('proofpix_user_id') || 'current_user',
    name: localStorage.getItem('proofpix_user_name') || 'Current User',
    email: localStorage.getItem('proofpix_user_email') || 'user@example.com'
  };

  useEffect(() => {
    loadSignatureRequests();
  }, [fileId]);

  const loadSignatureRequests = async () => {
    try {
      setLoading(true);
      // In production, this would load from backend
      const mockRequests: MultiSignatureRequest[] = [
        {
          id: 'req_001',
          fileId,
          fileName: 'evidence_photo_001.jpg',
          requestedBy: currentUser.id,
          requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          purpose: 'Evidence verification for Case #2024-001',
          threshold: 2,
          status: 'pending',
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          requiredSignatures: [
            {
              id: 'sig_001',
              userId: 'investigator_001',
              userName: 'Detective Sarah Johnson',
              userEmail: 'sarah.johnson@police.gov',
              role: 'investigator',
              required: true,
              status: 'signed',
              signedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              signature: 'digital_signature_hash_001',
              ipAddress: '192.168.1.100'
            },
            {
              id: 'sig_002',
              userId: 'supervisor_001',
              userName: 'Captain Michael Rodriguez',
              userEmail: 'michael.rodriguez@police.gov',
              role: 'supervisor',
              required: true,
              status: 'pending'
            }
          ],
          optionalSignatures: [
            {
              id: 'sig_003',
              userId: 'legal_001',
              userName: 'Attorney Lisa Chen',
              userEmail: 'lisa.chen@da.gov',
              role: 'legal_counsel',
              required: false,
              status: 'pending'
            }
          ]
        }
      ];
      setSignatureRequests(mockRequests);
    } catch (error) {
      await errorHandler.handleError('multi_signature_load', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const createSignatureRequest = async () => {
    try {
      const request: MultiSignatureRequest = {
        id: `req_${Date.now()}`,
        fileId,
        fileName: 'Current File',
        requestedBy: currentUser.id,
        requestedAt: new Date(),
        purpose: newRequest.purpose,
        threshold: newRequest.threshold,
        status: 'pending',
        deadline: newRequest.deadline ? new Date(newRequest.deadline) : undefined,
        requiredSignatures: newRequest.requiredSigners.map((signer, index) => ({
          id: `sig_${Date.now()}_${index}`,
          userId: `user_${index}`,
          userName: signer.email.split('@')[0],
          userEmail: signer.email,
          role: signer.role,
          required: true,
          status: 'pending' as const
        })),
        optionalSignatures: []
      };

      setSignatureRequests(prev => [...prev, request]);
      
      // Add custody event
      await chainOfCustody.addCustodyEvent(
        fileId,
        'transfer',
        `Multi-signature custody request created: ${newRequest.purpose}`,
        {
          metadata: {
            correlationId: fileId,
            sessionId: 'multi_sig_session',
            deviceFingerprint: 'device_fingerprint',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            source: 'ProofPix Multi-Signature System',
            evidence: {
              caseNumber: `MSIG-${request.id}`,
              evidenceTag: `Multi-signature request: ${newRequest.purpose}`,
              investigator: currentUser.name,
              department: 'Digital Forensics'
            }
          }
        }
      );

      setShowCreateRequest(false);
      setNewRequest({
        purpose: '',
        deadline: '',
        threshold: 2,
        requiredSigners: []
      });
    } catch (error) {
      await errorHandler.handleError('multi_signature_create', error as Error);
    }
  };

  const signRequest = async (requestId: string, signatureId: string, approved: boolean, comments?: string) => {
    try {
      setSignatureRequests(prev => prev.map(request => {
        if (request.id === requestId) {
          const updatedSignatures = request.requiredSignatures.map(sig => {
            if (sig.id === signatureId) {
              return {
                ...sig,
                status: (approved ? 'signed' : 'declined') as 'signed' | 'declined',
                signedAt: new Date(),
                signature: approved ? `digital_signature_${Date.now()}` : undefined,
                comments,
                ipAddress: '192.168.1.101',
                deviceInfo: navigator.userAgent
              };
            }
            return sig;
          });

          // Check if request is now complete
          const signedCount = updatedSignatures.filter(sig => sig.status === 'signed').length;
          const isComplete = signedCount >= request.threshold;

          return {
            ...request,
            requiredSignatures: updatedSignatures,
            status: isComplete ? 'completed' : request.status,
            completedAt: isComplete ? new Date() : undefined
          };
        }
        return request;
      }));

      // Add custody event
      await chainOfCustody.addCustodyEvent(
        fileId,
        'verification',
        `Multi-signature ${approved ? 'approved' : 'declined'} by ${currentUser.name}`,
        {
          metadata: {
            correlationId: fileId,
            sessionId: 'multi_sig_session',
            deviceFingerprint: 'device_fingerprint',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            source: 'ProofPix Multi-Signature System',
            evidence: {
              caseNumber: `MSIG-${requestId}`,
              evidenceTag: `Signature ${approved ? 'approved' : 'declined'}`,
              investigator: currentUser.name,
              department: 'Digital Forensics'
            }
          }
        }
      );
    } catch (error) {
      await errorHandler.handleError('multi_signature_sign', error as Error);
    }
  };

  const addRequiredSigner = () => {
    setNewRequest(prev => ({
      ...prev,
      requiredSigners: [...prev.requiredSigners, { email: '', role: 'investigator' }]
    }));
  };

  const removeRequiredSigner = (index: number) => {
    setNewRequest(prev => ({
      ...prev,
      requiredSigners: prev.requiredSigners.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'declined': return 'text-red-600';
      case 'expired': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'declined': return <X className="w-4 h-4 text-red-600" />;
      case 'expired': return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading signature requests...</span>
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
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Multi-Signature Custody
            </h2>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
              Collaborative
            </span>
          </div>
          <button
            onClick={() => setShowCreateRequest(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Signature Requests List */}
      <div className="p-6">
        {signatureRequests.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Signature Requests
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create a multi-signature request to enable collaborative custody management
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {signatureRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setActiveRequest(request)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {request.purpose}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Requested:</span> {request.requestedAt.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Threshold:</span> {request.threshold} signatures
                  </div>
                  {request.deadline && (
                    <div>
                      <span className="font-medium">Deadline:</span> {request.deadline.toLocaleString()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Progress:</span> {
                      request.requiredSignatures.filter(sig => sig.status === 'signed').length
                    } / {request.requiredSignatures.length} signed
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {request.requiredSignatures.map((signature) => (
                    <div
                      key={signature.id}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs"
                    >
                      {getStatusIcon(signature.status)}
                      <span className="text-gray-700 dark:text-gray-300">
                        {signature.userName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create Signature Request
                </h3>
                <button
                  onClick={() => setShowCreateRequest(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purpose
                  </label>
                  <input
                    type="text"
                    value={newRequest.purpose}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="e.g., Evidence verification for Case #2024-001"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Signature Threshold
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newRequest.threshold}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, threshold: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deadline (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={newRequest.deadline}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Required Signers
                    </label>
                    <button
                      onClick={addRequiredSigner}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Signer</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {newRequest.requiredSigners.map((signer, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="email"
                          placeholder="Email address"
                          value={signer.email}
                          onChange={(e) => {
                            const updatedSigners = [...newRequest.requiredSigners];
                            updatedSigners[index].email = e.target.value;
                            setNewRequest(prev => ({ ...prev, requiredSigners: updatedSigners }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <select
                          value={signer.role}
                          onChange={(e) => {
                            const updatedSigners = [...newRequest.requiredSigners];
                            updatedSigners[index].role = e.target.value as CustodySignature['role'];
                            setNewRequest(prev => ({ ...prev, requiredSigners: updatedSigners }));
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="investigator">Investigator</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="legal_counsel">Legal Counsel</option>
                          <option value="expert_witness">Expert Witness</option>
                          <option value="chain_manager">Chain Manager</option>
                        </select>
                        <button
                          onClick={() => removeRequiredSigner(index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateRequest(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createSignatureRequest}
                    disabled={!newRequest.purpose || newRequest.requiredSigners.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Create Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {activeRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Signature Request Details
                </h3>
                <button
                  onClick={() => setActiveRequest(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Request Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Request Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Purpose:</span>
                      <p className="text-gray-900 dark:text-white">{activeRequest.purpose}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Status:</span>
                      <p className={`capitalize ${getStatusColor(activeRequest.status)}`}>
                        {activeRequest.status}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Threshold:</span>
                      <p className="text-gray-900 dark:text-white">{activeRequest.threshold} signatures required</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Progress:</span>
                      <p className="text-gray-900 dark:text-white">
                        {activeRequest.requiredSignatures.filter(sig => sig.status === 'signed').length} / {activeRequest.requiredSignatures.length} signed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Required Signatures</h4>
                  <div className="space-y-3">
                    {activeRequest.requiredSignatures.map((signature) => (
                      <div
                        key={signature.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(signature.status)}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {signature.userName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {signature.userEmail} • {signature.role.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          {signature.status === 'pending' && signature.userId === currentUser.id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => signRequest(activeRequest.id, signature.id, false)}
                                className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => signRequest(activeRequest.id, signature.id, true)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Sign
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {signature.signedAt && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <p>Signed: {signature.signedAt.toLocaleString()}</p>
                            {signature.ipAddress && (
                              <p>IP: {signature.ipAddress}</p>
                            )}
                            {signature.comments && (
                              <p>Comments: {signature.comments}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 