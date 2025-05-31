import React, { useState } from 'react';
import { Shield, Zap, Settings, Lightbulb, ChevronRight, FileText, Upload } from 'lucide-react';
import { 
  AdaptiveUXSystem, 
  useAdaptiveUI, 
  useFeatureDiscovery,
  SmartTooltip
} from '../components/adaptive/AdaptiveUXSystem';

const AdaptiveUXDemo: React.FC = () => {
  const { userContext, updatePreferences, shouldShowFeature } = useAdaptiveUI();
  const { showHint, trackAchievementProgress } = useFeatureDiscovery();
  const [activeTab, setActiveTab] = useState('overview');

  // Handle uploading a sample image to trigger achievement
  const handleSampleUpload = () => {
    // Track the upload as a feature used
    trackAchievementProgress('single_upload');
    
    // Show security hint after first upload
    setTimeout(() => {
      showHint('security_features_hint');
    }, 1500);
  };

  // Handle exporting metadata to trigger PDF hint
  const handleExportMetadata = () => {
    // Track export as a feature used
    trackAchievementProgress('metadata_export');
    
    // After 3 exports, the PDF hint will automatically be shown
    // via the FeatureDiscoverySystem trigger system
  };

  // Toggle advanced features visibility
  const toggleAdvancedFeatures = () => {
    updatePreferences({
      showAdvancedFeatures: !userContext.preferences.showAdvancedFeatures
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Adaptive UX System Demo</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Experience how the system adapts to different user types, devices, and behaviors.
            Interact with features to see contextual hints and progressive disclosure in action.
          </p>
        </div>

        {/* User Context Display */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current User Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-amber-500" />
                User Intent
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {userContext.intent ? userContext.intent.id : 'No intent selected'}
              </p>
              {userContext.intent && (
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Flow: {userContext.intent.flow}
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Settings className="w-4 h-4 mr-2 text-blue-500" />
                Experience Level
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userContext.experienceLevel === 'beginner'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : userContext.experienceLevel === 'intermediate'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                }`}>
                  {userContext.experienceLevel}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Sessions: {userContext.usage.sessionCount}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                Revealed Features
              </h3>
              <div className="flex flex-wrap gap-1">
                {userContext.revealedFeatures.length > 0 ? (
                  userContext.revealedFeatures.map(feature => (
                    <span key={feature} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 text-sm">No features revealed yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-1 px-1">
              {['overview', 'onboarding', 'discovery', 'mobile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  The Adaptive UX System is designed to provide a personalized user experience
                  based on user intent, behavior, and device capabilities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Key Components</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Adaptive Onboarding System</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Feature Discovery System</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Adaptive Navigation</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Mobile-First Enhancements</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Smart Tooltips</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">System Features</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-green-500" />
                        <span>User Intent Detection</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-green-500" />
                        <span>Progressive Feature Revelation</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-green-500" />
                        <span>Contextual Hints & Achievements</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-green-500" />
                        <span>Adaptive Navigation & Content</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-green-500" />
                        <span>Responsive & Touch-Optimized UI</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'onboarding' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Adaptive Onboarding</h2>
                <p className="mb-6 text-slate-600 dark:text-slate-400">
                  The onboarding system adapts to user intent and progressively reveals features
                  based on the user's selected path. Try the following actions:
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      // This would typically be handled by AdaptiveOnboardingSystem
                      alert('The onboarding system would reset and show the intent detection modal.');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-between"
                  >
                    <span>Start Onboarding Experience</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Available User Intents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="font-medium mb-1">Quick Photo Analysis</div>
                        <div className="text-slate-500 dark:text-slate-400">For casual users</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="font-medium mb-1">Professional Documentation</div>
                        <div className="text-slate-500 dark:text-slate-400">For work use cases</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="font-medium mb-1">Enterprise Evaluation</div>
                        <div className="text-slate-500 dark:text-slate-400">For organizations</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="font-medium mb-1">Privacy-First Processing</div>
                        <div className="text-slate-500 dark:text-slate-400">For privacy-focused users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'discovery' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Feature Discovery</h2>
                <p className="mb-6 text-slate-600 dark:text-slate-400">
                  Features are progressively revealed based on user behavior and achievements.
                  Try these actions to trigger contextual hints and unlock features:
                </p>

                <div className="space-y-4">
                  <SmartTooltip
                    id="upload_tooltip"
                    content={{
                      title: "Upload & Process Images",
                      description: "Upload an image to see how features are revealed based on your actions.",
                      level: "beginner",
                      category: "feature",
                      nextSteps: ["Try exporting metadata after upload"]
                    }}
                    placement="right"
                  >
                    <button
                      onClick={handleSampleUpload}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Upload className="w-5 h-5 mr-2" />
                        <span>Upload Sample Image</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </SmartTooltip>

                  <button
                    onClick={handleExportMetadata}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      <span>Export Sample Metadata</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                      Pro Tip
                    </h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Actions like uploading images, exporting data, and viewing settings will trigger
                      contextual hints and unlock achievements. Try clicking the buttons above multiple times.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={toggleAdvancedFeatures}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-sm font-medium transition-colors"
                    >
                      {userContext.preferences.showAdvancedFeatures 
                        ? "Hide Advanced Features" 
                        : "Show Advanced Features"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mobile' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Mobile Optimizations</h2>
                <p className="mb-6 text-slate-600 dark:text-slate-400">
                  The system automatically adapts to different screen sizes and touch interfaces.
                  Resize your browser or view on a mobile device to see these adaptations in action:
                </p>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Mobile-First Features</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Adaptive Navigation (switches to bottom nav on mobile)</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Touch-Optimized Controls</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Swipe Gestures for Navigation</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Compact Layout for Small Screens</span>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                        <span>Quick Access Floating Action Buttons</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Try These Actions</h3>
                    <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                      <li>• Resize browser window to mobile width (&lt;768px)</li>
                      <li>• On touch devices, try swiping from edges</li>
                      <li>• Notice how navigation adapts to available space</li>
                      <li>• Observe contextual helpers that appear on mobile</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the demo with the AdaptiveUXSystem
const AdaptiveUXDemoPage: React.FC = () => {
  return (
    <AdaptiveUXSystem
      config={{
        enableOnboarding: true,
        enableFeatureDiscovery: true,
        navigation: {
          variant: 'top',
          showLogo: true
        },
        mobileOptimization: {
          enabled: true,
          enableSwipeGestures: true,
          compactMode: true
        }
      }}
    >
      <AdaptiveUXDemo />
    </AdaptiveUXSystem>
  );
};

export default AdaptiveUXDemoPage; 