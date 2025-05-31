/**
 * Enterprise API Service
 * Mock implementation for demonstration purposes
 */

// Define the contact form data interface
export interface EnterpriseContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  industry: string;
  employeeCount: string;
  message: string;
  privacyPolicy: boolean;
}

// Define whitepaper request interface
export interface WhitepaperRequestData {
  email: string;
}

// Mock API response delay
const MOCK_DELAY = 1500;

/**
 * Submit enterprise contact form data
 * Mock implementation that returns a successful response after a delay
 */
export const submitEnterpriseContactForm = async (data: EnterpriseContactFormData): Promise<{ success: boolean; message: string }> => {
  console.log('Enterprise contact form data submitted:', data);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // Always return success for demo purposes
  // In a real implementation, this would make an actual API call to a backend service
  return {
    success: true,
    message: 'Your information has been submitted successfully. Our enterprise team will contact you within one business day.'
  };
};

/**
 * Request enterprise security whitepaper
 * Mock implementation that returns a successful response after a delay
 */
export const requestEnterpriseWhitepaper = async (data: WhitepaperRequestData): Promise<{ success: boolean; message: string }> => {
  console.log('Whitepaper requested for email:', data.email);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // Always return success for demo purposes
  return {
    success: true,
    message: 'Thank you for your interest! The enterprise security whitepaper has been sent to your email.'
  };
};

/**
 * Schedule enterprise demo
 * Mock implementation that returns a successful response after a delay
 */
export const scheduleEnterpriseDemo = async (data: EnterpriseContactFormData): Promise<{ success: boolean; message: string; demoId?: string }> => {
  console.log('Enterprise demo requested:', data);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // Generate a mock demo ID
  const demoId = `demo-${Math.random().toString(36).substring(2, 10)}`;
  
  // Always return success for demo purposes
  return {
    success: true,
    message: 'Your demo has been scheduled successfully. You will receive a confirmation email shortly.',
    demoId
  };
};

/**
 * Track enterprise page visit
 * Mock analytics implementation
 */
export const trackEnterprisePageVisit = (pageName: string, metadata?: Record<string, any>): void => {
  console.log(`Enterprise page visit: ${pageName}`, metadata || {});
  
  // In a real implementation, this would send analytics data to a tracking service
};

export default {
  submitEnterpriseContactForm,
  requestEnterpriseWhitepaper,
  scheduleEnterpriseDemo,
  trackEnterprisePageVisit
}; 