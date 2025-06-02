/**
 * UI Showcase Page
 * Demonstrates all the new UI improvements and components
 */

import React, { useState } from 'react';
import { StandardLayout } from '../components/ui/StandardLayout';
import { LoadingSpinner, LoadingState, ProcessingStages, FileUploadLoading, CardSkeleton } from '../components/ui/LoadingStates';
import { NotificationProvider, useNotifications, Alert, StatusBanner, NotificationBell } from '../components/ui/NotificationSystem';
import { ModernInput, ModernTextArea, ModernSelect, ModernFileUpload, SearchInput } from '../components/ui/ModernFormComponents';
import { MetricCard, SimpleLineChart, SimpleBarChart, ProgressBar, ActivityFeed, StatsGrid } from '../components/ui/DataVisualization';
import { Modal, Tooltip, Dropdown, Tabs, Accordion, ToggleSwitch, Popover } from '../components/ui/InteractiveElements';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  MoreVertical, 
  Info,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Eye,
  Camera
} from 'lucide-react';

const UIShowcaseContent: React.FC = () => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    files: [] as File[]
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleStates, setToggleStates] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });

  // Sample data for charts
  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 90 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 88 }
  ];

  const barData = [
    { label: 'Images', value: 1250, color: '#3B82F6' },
    { label: 'Documents', value: 890, color: '#10B981' },
    { label: 'Videos', value: 450, color: '#F59E0B' },
    { label: 'Audio', value: 320, color: '#EF4444' }
  ];

  const processingStages = [
    { id: 'upload', label: 'Upload File', status: 'completed' as const },
    { id: 'validate', label: 'Validate Format', status: 'completed' as const },
    { id: 'process', label: 'Extract Metadata', status: 'active' as const },
    { id: 'analyze', label: 'AI Analysis', status: 'pending' as const },
    { id: 'complete', label: 'Generate Report', status: 'pending' as const }
  ];

  const activities = [
    {
      id: '1',
      type: 'upload' as const,
      message: 'New image uploaded: IMG_2024_001.jpg',
      timestamp: new Date(Date.now() - 5 * 60000),
      user: 'John Doe'
    },
    {
      id: '2',
      type: 'process' as const,
      message: 'Metadata extraction completed for batch #1247',
      timestamp: new Date(Date.now() - 15 * 60000),
      user: 'System'
    },
    {
      id: '3',
      type: 'download' as const,
      message: 'Report downloaded: analysis_report.pdf',
      timestamp: new Date(Date.now() - 30 * 60000),
      user: 'Jane Smith'
    }
  ];

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: 'Success!', message: 'Operation completed successfully.' },
      error: { title: 'Error!', message: 'Something went wrong. Please try again.' },
      warning: { title: 'Warning!', message: 'Please review your input before proceeding.' },
      info: { title: 'Info', message: 'Here\'s some helpful information.' }
    };

    addNotification({
      type,
      title: messages[type].title,
      message: messages[type].message
    });
  };

  return (
    <StandardLayout
      showHero
      title="UI Component Showcase"
      description="Explore our modern, accessible, and beautiful UI components"
      maxWidth="7xl"
    >
      <div className="space-y-12">
        {/* Status Banner */}
        <StatusBanner
          type="info"
          message="🎉 New UI components are now available! Explore the enhanced user experience below."
          dismissible
        />

        {/* Loading States Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading States</h2>
            <p className="text-lg text-gray-600">Beautiful loading animations and progress indicators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Spinners</h3>
              <div className="flex items-center space-x-4">
                <LoadingSpinner size="sm" variant="primary" />
                <LoadingSpinner size="md" variant="success" />
                <LoadingSpinner size="lg" variant="warning" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Progress Bars</h3>
              <div className="space-y-3">
                <ProgressBar value={75} label="Upload Progress" color="blue" />
                <ProgressBar value={45} label="Processing" color="green" />
                <ProgressBar value={90} label="Analysis" color="yellow" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Loading States</h3>
              <div className="space-y-4">
                <LoadingState type="dots" text="Loading..." />
                <LoadingState type="pulse" size="sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileUploadLoading
              fileName="document.pdf"
              progress={65}
              stage="processing"
            />
            <ProcessingStages
              stages={processingStages}
              currentStage="process"
            />
          </div>
        </section>

        {/* Form Components Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Modern Forms</h2>
            <p className="text-lg text-gray-600">Enhanced form components with validation and accessibility</p>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput
                label="Full Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="Enter your full name"
                icon={<Users className="w-5 h-5" />}
                required
              />

              <ModernInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                placeholder="Enter your email"
                success={formData.email.includes('@')}
                required
              />

              <ModernSelect
                label="Category"
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                options={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'support', label: 'Technical Support' },
                  { value: 'sales', label: 'Sales Question' },
                  { value: 'feedback', label: 'Feedback' }
                ]}
                placeholder="Select a category"
              />

              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="Search components..."
              />
            </div>

            <div className="mt-6">
              <ModernTextArea
                label="Message"
                value={formData.message}
                onChange={(value) => setFormData({ ...formData, message: value })}
                placeholder="Tell us more about your inquiry..."
                rows={4}
                maxLength={500}
              />
            </div>

            <div className="mt-6">
              <ModernFileUpload
                label="Attachments"
                accept=".jpg,.png,.pdf,.doc,.docx"
                multiple
                maxSize={10}
                onFileSelect={(files) => setFormData({ ...formData, files })}
                preview
              />
            </div>
          </div>
        </section>

        {/* Data Visualization Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Visualization</h2>
            <p className="text-lg text-gray-600">Beautiful charts and metrics for data presentation</p>
          </div>

          <StatsGrid
            stats={[
              {
                label: 'Total Users',
                value: '12,543',
                icon: <Users className="w-6 h-6" />,
                color: 'blue',
                change: { value: 12, type: 'increase', period: 'this month' }
              },
              {
                label: 'Files Processed',
                value: '89,234',
                icon: <FileText className="w-6 h-6" />,
                color: 'green',
                change: { value: 8, type: 'increase', period: 'this week' }
              },
              {
                label: 'Success Rate',
                value: '99.2%',
                icon: <CheckCircle className="w-6 h-6" />,
                color: 'green'
              },
              {
                label: 'Active Sessions',
                value: '1,847',
                icon: <Activity className="w-6 h-6" />,
                color: 'purple',
                change: { value: 3, type: 'decrease', period: 'today' }
              }
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleLineChart
              data={chartData}
              title="Monthly Growth"
              height={300}
              color="#10B981"
            />
            <SimpleBarChart
              data={barData}
              title="File Types Processed"
              height={300}
            />
          </div>

          <ActivityFeed activities={activities} />
        </section>

        {/* Interactive Elements Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Elements</h2>
            <p className="text-lg text-gray-600">Modals, tooltips, dropdowns, and more interactive components</p>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Modal Trigger */}
              <div className="text-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Modal
                </button>
                <p className="text-sm text-gray-600 mt-2">Click to see modal</p>
              </div>

              {/* Tooltip */}
              <div className="text-center">
                <Tooltip content="This is a helpful tooltip with additional information">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Hover for Tooltip
                  </button>
                </Tooltip>
                <p className="text-sm text-gray-600 mt-2">Hover to see tooltip</p>
              </div>

              {/* Dropdown */}
              <div className="text-center">
                <Dropdown
                  trigger={
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <span>Actions</span>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                  items={[
                    { label: 'Edit', onClick: () => showNotification('info'), icon: <Settings className="w-4 h-4" /> },
                    { label: 'Download', onClick: () => showNotification('success'), icon: <Download className="w-4 h-4" /> },
                    { divider: true } as any,
                    { label: 'Delete', onClick: () => showNotification('error'), icon: <AlertTriangle className="w-4 h-4" /> }
                  ]}
                />
                <p className="text-sm text-gray-600 mt-2">Click for dropdown</p>
              </div>

              {/* Popover */}
              <div className="text-center">
                <Popover
                  trigger={
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Show Popover
                    </button>
                  }
                  content={
                    <div className="space-y-2">
                      <h4 className="font-semibold">Quick Actions</h4>
                      <p className="text-sm text-gray-600">Choose an action to perform:</p>
                      <div className="space-y-1">
                        <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm">
                          View Details
                        </button>
                        <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm">
                          Share
                        </button>
                      </div>
                    </div>
                  }
                />
                <p className="text-sm text-gray-600 mt-2">Click for popover</p>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  checked={toggleStates.notifications}
                  onChange={(checked) => setToggleStates({ ...toggleStates, notifications: checked })}
                  label="Email Notifications"
                  description="Receive email notifications for important updates"
                />
                <ToggleSwitch
                  checked={toggleStates.darkMode}
                  onChange={(checked) => setToggleStates({ ...toggleStates, darkMode: checked })}
                  label="Dark Mode"
                  description="Switch to dark theme for better viewing in low light"
                />
                <ToggleSwitch
                  checked={toggleStates.autoSave}
                  onChange={(checked) => setToggleStates({ ...toggleStates, autoSave: checked })}
                  label="Auto Save"
                  description="Automatically save your work every few minutes"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              {
                id: 'overview',
                label: 'Overview',
                icon: <Eye className="w-4 h-4" />,
                content: (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Overview</h3>
                    <p className="text-gray-600">
                      This is the overview tab content. Here you can see a summary of all the important information.
                    </p>
                    <Alert
                      type="info"
                      title="Welcome!"
                      message="This is an informational alert in the overview tab."
                    />
                  </div>
                )
              },
              {
                id: 'details',
                label: 'Details',
                icon: <FileText className="w-4 h-4" />,
                content: (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detailed Information</h3>
                    <p className="text-gray-600">
                      This tab contains more detailed information about the selected item.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Technical Specifications</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• React 18+ compatible</li>
                        <li>• TypeScript support</li>
                        <li>• Tailwind CSS styling</li>
                        <li>• Accessibility compliant</li>
                      </ul>
                    </div>
                  </div>
                )
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: <Settings className="w-4 h-4" />,
                content: (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Configuration</h3>
                    <p className="text-gray-600">
                      Configure your preferences and settings here.
                    </p>
                    <Alert
                      type="warning"
                      title="Configuration Warning"
                      message="Changes to these settings will affect all users."
                    />
                  </div>
                )
              }
            ]}
            defaultTab="overview"
          />

          {/* Accordion */}
          <Accordion
            items={[
              {
                id: 'faq1',
                title: 'How do I upload files?',
                icon: <Upload className="w-5 h-5" />,
                content: (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      You can upload files by clicking the upload button or dragging and dropping files into the designated area.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Supported formats: JPG, PNG, PDF, DOC, DOCX</li>
                      <li>• Maximum file size: 10MB</li>
                      <li>• Multiple files can be uploaded at once</li>
                    </ul>
                  </div>
                )
              },
              {
                id: 'faq2',
                title: 'What file formats are supported?',
                icon: <FileText className="w-5 h-5" />,
                content: (
                  <p className="text-gray-600">
                    We support a wide range of file formats including images (JPG, PNG, GIF), documents (PDF, DOC, DOCX), 
                    and many others. Check our documentation for the complete list.
                  </p>
                )
              },
              {
                id: 'faq3',
                title: 'How secure is my data?',
                icon: <Shield className="w-5 h-5" />,
                content: (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Your data security is our top priority. We use enterprise-grade encryption and security measures.
                    </p>
                    <Alert
                      type="success"
                      title="Security Features"
                      message="End-to-end encryption, secure data centers, and regular security audits."
                    />
                  </div>
                )
              }
            ]}
            allowMultiple
          />
        </section>

        {/* Notification Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h2>
            <p className="text-lg text-gray-600">Toast notifications and alert system</p>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => showNotification('success')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Success Toast
              </button>
              <button
                onClick={() => showNotification('error')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Error Toast
              </button>
              <button
                onClick={() => showNotification('warning')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Warning Toast
              </button>
              <button
                onClick={() => showNotification('info')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Info Toast
              </button>
            </div>

            <div className="space-y-4">
              <Alert
                type="success"
                title="Success Alert"
                message="This is a success alert with a close button."
                onClose={() => {}}
              />
              <Alert
                type="warning"
                title="Warning Alert"
                message="This is a warning alert with an action button."
                action={{
                  label: 'Take Action',
                  onClick: () => showNotification('info')
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an example modal dialog. It can contain any content you need, including forms, 
            images, or other components.
          </p>
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Modal with icon and content</span>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showNotification('success');
                setIsModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </StandardLayout>
  );
};

const UIShowcase: React.FC = () => {
  return (
    <NotificationProvider>
      <UIShowcaseContent />
    </NotificationProvider>
  );
};

export default UIShowcase; 