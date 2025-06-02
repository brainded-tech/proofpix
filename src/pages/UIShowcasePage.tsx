import React, { useState } from 'react';
import { UnifiedLayout } from '../components/ui/UnifiedLayout';
import { 
  InputField, 
  TextareaField, 
  SelectField, 
  FileUploadField, 
  Button, 
  Form 
} from '../components/ui/StandardizedForms';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  Globe,
  Upload,
  Star,
  Shield,
  Zap
} from 'lucide-react';

export const UIShowcasePage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    website: '',
    role: '',
    bio: '',
    files: [] as File[]
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSuccess, setFormSuccess] = useState<Record<string, string>>({});

  // Mock user for navigation demo
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    tier: 'pro' as const,
    isAuthenticated: true
  };

  const roleOptions = [
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Project Manager' },
    { value: 'executive', label: 'Executive' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Add success state for email validation
    if (field === 'email' && value.includes('@') && value.includes('.')) {
      setFormSuccess(prev => ({ ...prev, email: 'Valid email format' }));
    } else if (field === 'email') {
      setFormSuccess(prev => ({ ...prev, email: '' }));
    }
  };

  const handleFileChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, files }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const errors: Record<string, string> = {};
    
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  return (
    <UnifiedLayout
      user={mockUser}
      pageTitle="UI Component Showcase"
      pageDescription="Demonstration of our unified navigation system and standardized form components with modern design patterns."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Documentation', href: '/docs' },
        { label: 'UI Showcase' }
      ]}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Components Demo */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Standardized Form Components
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Our unified form system provides consistent styling, validation, and accessibility across all components.
              </p>
            </div>

            <Form
              title="User Registration"
              description="Complete the form below to create your account"
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  error={formErrors.firstName}
                  required
                  icon={<User className="w-4 h-4" />}
                />
                
                <InputField
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  error={formErrors.lastName}
                  required
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              {/* Email Field */}
              <InputField
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={formErrors.email}
                success={formSuccess.email}
                required
                icon={<Mail className="w-4 h-4" />}
                hint="We'll never share your email with anyone else"
              />

              {/* Password Field */}
              <InputField
                type="password"
                label="Password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                error={formErrors.password}
                required
                icon={<Lock className="w-4 h-4" />}
                showPasswordToggle
                hint="Password must be at least 8 characters long"
              />

              {/* Phone Field */}
              <InputField
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                icon={<Phone className="w-4 h-4" />}
              />

              {/* Company Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company"
                  placeholder="Enter your company name"
                  value={formData.company}
                  onChange={(value) => handleInputChange('company', value)}
                  icon={<Building2 className="w-4 h-4" />}
                />
                
                <InputField
                  type="url"
                  label="Website"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(value) => handleInputChange('website', value)}
                  icon={<Globe className="w-4 h-4" />}
                />
              </div>

              {/* Role Select */}
              <SelectField
                label="Role"
                placeholder="Select your role"
                value={formData.role}
                onChange={(value) => handleInputChange('role', value)}
                options={roleOptions}
                icon={<Star className="w-4 h-4" />}
              />

              {/* Bio Textarea */}
              <TextareaField
                label="Bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(value) => handleInputChange('bio', value)}
                rows={4}
                maxLength={500}
                hint="Share a brief description about yourself and your work"
              />

              {/* File Upload */}
              <FileUploadField
                label="Profile Documents"
                value={formData.files}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                multiple
                maxSize={5 * 1024 * 1024} // 5MB
                maxFiles={3}
                hint="Upload your profile picture, resume, or other relevant documents"
              />

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={<Shield className="w-4 h-4" />}
                  fullWidth
                >
                  Create Account
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>

          {/* Component Variants Demo */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Component Variants
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Explore different styles and states of our form components.
              </p>
            </div>

            {/* Button Variants */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Button Variants
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="primary" icon={<Zap className="w-4 h-4" />}>
                    Primary
                  </Button>
                  <Button variant="secondary">
                    Secondary
                  </Button>
                  <Button variant="outline">
                    Outline
                  </Button>
                  <Button variant="ghost">
                    Ghost
                  </Button>
                  <Button variant="success" icon={<Shield className="w-4 h-4" />}>
                    Success
                  </Button>
                  <Button variant="danger">
                    Danger
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Button variant="primary" size="sm" fullWidth>
                    Small Button
                  </Button>
                  <Button variant="primary" size="md" fullWidth>
                    Medium Button
                  </Button>
                  <Button variant="primary" size="lg" fullWidth>
                    Large Button
                  </Button>
                  <Button variant="primary" size="xl" fullWidth>
                    Extra Large Button
                  </Button>
                </div>

                <Button variant="primary" loading fullWidth>
                  Loading State
                </Button>
                
                <Button variant="primary" disabled fullWidth>
                  Disabled State
                </Button>
              </div>
            </div>

            {/* Input States */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Input States
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Default State"
                  placeholder="Enter some text..."
                  icon={<User className="w-4 h-4" />}
                />
                
                <InputField
                  label="Success State"
                  value="john@example.com"
                  success="Email is valid"
                  icon={<Mail className="w-4 h-4" />}
                />
                
                <InputField
                  label="Error State"
                  value="invalid-email"
                  error="Please enter a valid email address"
                  icon={<Mail className="w-4 h-4" />}
                />
                
                <InputField
                  label="Disabled State"
                  value="Cannot edit this field"
                  disabled
                  icon={<Lock className="w-4 h-4" />}
                />
                
                <InputField
                  label="With Hint"
                  placeholder="Enter your password"
                  hint="Password must be at least 8 characters"
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Select Demo */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Select Component
              </h3>
              <SelectField
                label="Choose an Option"
                placeholder="Select from dropdown..."
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3 (Disabled)', disabled: true },
                  { value: 'option4', label: 'Option 4' }
                ]}
                icon={<Star className="w-4 h-4" />}
                hint="This is a custom select component with search and keyboard navigation"
              />
            </div>

            {/* File Upload Demo */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                File Upload Component
              </h3>
              <FileUploadField
                label="Upload Files"
                accept="image/*"
                multiple
                maxSize={2 * 1024 * 1024} // 2MB
                maxFiles={5}
                hint="Drag and drop images here, or click to browse"
              />
            </div>
          </div>
        </div>

        {/* Navigation Demo Info */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Unified Navigation System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Features
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Responsive design with mobile-first approach</li>
                <li>• User-tier-aware navigation items</li>
                <li>• Smooth animations and transitions</li>
                <li>• Dropdown menus with keyboard navigation</li>
                <li>• User profile menu with avatar support</li>
                <li>• Notification indicators</li>
                <li>• Consistent branding across all pages</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Variants
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>Default:</strong> Semi-transparent with blur effect</li>
                <li>• <strong>Transparent:</strong> Fully transparent until scroll</li>
                <li>• <strong>Solid:</strong> Opaque background for app pages</li>
                <li>• <strong>Authenticated:</strong> Shows user menu and app navigation</li>
                <li>• <strong>Public:</strong> Shows marketing navigation and CTAs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}; 