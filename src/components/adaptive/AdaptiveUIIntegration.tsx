import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Zap, 
  Shield, 
  Users,
  FileText,
  Download,
  Building2,
  Star,
  Lightbulb
} from 'lucide-react';
import { useAdaptiveUI, useUIComplexity, useFeatureFlag } from './AdaptiveUIProvider';
import SmartTooltip from './SmartTooltipSystem';
import ProgressiveDisclosurePanel from './ProgressiveDisclosurePanel';

interface AdaptiveUIIntegrationProps {
  children?: React.ReactNode;
  showPreferences?: boolean;
}

export const AdaptiveUIIntegration: React.FC<AdaptiveUIIntegrationProps> = ({
  children,
  showPreferences = false
}) => {
  const { userContext, updatePreferences, resetOnboarding } = useAdaptiveUI();
  const { complexity, isSimple, isAdvanced, showTooltips, compactMode } = useUIComplexity();
  const [showSettings, setShowSettings] = useState(false);

  const hasAdvancedFeatures = useFeatureFlag('batch_processing');
  const hasEnterpriseFeatures = useFeatureFlag('enterprise_demo');

  const handlePreferenceChange = (key: string, value: any) => {
    updatePreferences({ [key]: value });
  };

  const getExperienceBadge = () => {
    const level = userContext.experienceLevel;
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      expert: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* User Context Display */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Adaptive UI Status
          </h3>
          <div className="flex items-center space-x-2">
            {getExperienceBadge()}
            <SmartTooltip
              id="ui-settings"
              content={{
                title: "UI Preferences",
                description: "Customize your interface based on your experience level and preferences",
                level: 'intermediate',
                category: 'feature',
                actions: [
                  {
                    label: "Open Settings",
                    action: () => setShowSettings(true),
                    primary: true
                  }
                ]
              }}
              trigger="hover"
            >
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </SmartTooltip>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Sessions:</span>
            <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
              {userContext.usage.sessionCount}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Features Used:</span>
            <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
              {userContext.usage.featuresUsed.length}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">UI Complexity:</span>
            <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
              {complexity}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Intent:</span>
            <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
              {userContext.intent?.title || 'None'}
            </span>
          </div>
        </div>

        {userContext.revealedFeatures.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Revealed Features:</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {userContext.revealedFeatures.map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                >
                  {feature.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
        >
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            UI Preferences
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Show Advanced Features
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Display expert-level functionality regardless of experience level
                </p>
              </div>
              <button
                onClick={() => handlePreferenceChange('showAdvancedFeatures', !userContext.preferences.showAdvancedFeatures)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  userContext.preferences.showAdvancedFeatures ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    userContext.preferences.showAdvancedFeatures ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Enable Tooltips
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Show contextual help and guidance
                </p>
              </div>
              <button
                onClick={() => handlePreferenceChange('enableTooltips', !userContext.preferences.enableTooltips)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  userContext.preferences.enableTooltips ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    userContext.preferences.enableTooltips ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Compact Mode
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use smaller spacing and condensed layouts
                </p>
              </div>
              <button
                onClick={() => handlePreferenceChange('compactMode', !userContext.preferences.compactMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  userContext.preferences.compactMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    userContext.preferences.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Preferred View
              </label>
              <select
                value={userContext.preferences.preferredView}
                onChange={(e) => handlePreferenceChange('preferredView', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="simple">Simple</option>
                <option value="detailed">Detailed</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={resetOnboarding}
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Reset Onboarding
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Adaptive Feature Showcase */}
      <ProgressiveDisclosurePanel
        title="Adaptive Features Demo"
        description="Features that adapt based on your experience level and preferences"
        sections={[
          {
            id: 'basic-tools',
            title: 'Essential Tools',
            description: 'Always available core functionality',
            level: 'beginner',
            category: 'basic',
            defaultExpanded: isSimple,
            children: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SmartTooltip
                    id="basic-upload"
                    content={{
                      title: "File Upload",
                      description: "Upload images for metadata extraction",
                      level: 'beginner',
                      category: 'feature',
                      nextSteps: ["Select an image", "View extracted data", "Export results"]
                    }}
                    trigger="hover"
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <FileText className="w-6 h-6 text-blue-500 mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Upload Images</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Drag and drop or select images to analyze
                      </p>
                    </div>
                  </SmartTooltip>

                  <SmartTooltip
                    id="basic-export"
                    content={{
                      title: "Export Data",
                      description: "Download your extracted metadata in various formats",
                      level: 'beginner',
                      category: 'feature',
                      relatedFeatures: ['CSV Export', 'JSON Export', 'PDF Reports']
                    }}
                    trigger="hover"
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-colors">
                      <Download className="w-6 h-6 text-green-500 mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Export Results</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Save your data in multiple formats
                      </p>
                    </div>
                  </SmartTooltip>
                </div>
              </div>
            )
          },
          {
            id: 'advanced-tools',
            title: 'Professional Tools',
            description: 'Advanced features for power users',
            level: 'intermediate',
            category: 'advanced',
            requiredFeatures: ['batch_processing'],
            children: (
              <div className="space-y-4">
                {hasAdvancedFeatures ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <Users className="w-6 h-6 text-purple-500 mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Batch Processing</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Process multiple images simultaneously
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <FileText className="w-6 h-6 text-orange-500 mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Custom Reports</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Generate branded PDF reports
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Advanced Features Available
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Use the platform more to unlock professional tools
                    </p>
                  </div>
                )}
              </div>
            )
          },
          {
            id: 'enterprise-tools',
            title: 'Enterprise Solutions',
            description: 'Enterprise-grade features and compliance',
            level: 'expert',
            category: 'enterprise',
            requiredFeatures: ['enterprise_demo'],
            premium: true,
            children: (
              <div className="space-y-4">
                {hasEnterpriseFeatures ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <Building2 className="w-6 h-6 text-emerald-500 mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">White-Label</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Custom branding for your organization
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <Shield className="w-6 h-6 text-red-500 mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Compliance Suite</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        GDPR, CCPA, HIPAA compliance
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Enterprise Features
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Contact us to explore enterprise solutions
                    </p>
                  </div>
                )}
              </div>
            )
          }
        ]}
        allowMultipleExpanded={true}
        showLevelIndicators={true}
        compactMode={compactMode}
      />

      {/* Children content */}
      {children}
    </div>
  );
};

export default AdaptiveUIIntegration; 