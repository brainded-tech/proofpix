import React, { useState } from 'react';
import { BrandingManager } from '../components/enterprise/BrandingManager';
import { BrandingConfig } from '../services/brandingService';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';

export default function EnterpriseBranding() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showManager, setShowManager] = useState<boolean>(false);
  const [config, setConfig] = useState<BrandingConfig | null>(null);
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setShowManager(true);
    }
  };
  
  const handleSuccess = (config: BrandingConfig) => {
    setConfig(config);
    alert('Branding configuration updated successfully!');
  };
  
  const handleError = (error: Error) => {
    console.error('Branding error:', error);
    alert(`Error: ${error.message}`);
  };

  return (
    <EnterpriseLayout
      showHero
      title="Enterprise Branding Configuration"
      description="Configure your organization's branding for ProofPix"
      maxWidth="6xl"
      backgroundColor="dark"
    >
      {!showManager ? (
        <div className="max-w-md mx-auto bg-slate-800 rounded-lg shadow-md border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Enter API Key</h2>
          <p className="text-slate-300 mb-4">
            To configure your enterprise branding, please enter your API key.
          </p>
          
          <form onSubmit={handleApiKeySubmit}>
            <div className="mb-4">
              <label htmlFor="api-key" className="block text-sm font-medium text-slate-300 mb-1">
                API Key
              </label>
              <input
                type="text"
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 text-slate-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your API key"
                required
              />
        </div>
            
              <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue
              </button>
          </form>
        </div>
      ) : (
        <div>
          <BrandingManager 
            apiKey={apiKey}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          
          {config && (
            <div className="mt-8 bg-slate-800 rounded-lg shadow-md border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Configuration Summary</h2>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-auto text-xs text-slate-300">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          )}
          </div>
      )}
    </EnterpriseLayout>
  );
}
