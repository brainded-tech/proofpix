import React, { useEffect } from 'react';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { EnterpriseButton } from '../components/ui/EnterpriseComponents';
import { ExternalLink, ArrowLeft } from 'lucide-react';

const Blog: React.FC = () => {
  // Redirect to external blog
  useEffect(() => {
    window.location.href = 'https://blog.proofpixapp.com';
  }, []);

  return (
    <EnterpriseLayout
      showHero
      title="ProofPix Blog"
      description="Insights, tutorials, and updates from the ProofPix team"
      maxWidth="4xl"
    >
      <div className="text-center py-16">
        <ExternalLink className="h-16 w-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Blog Coming Soon
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          We're working on bringing you the latest insights about metadata analysis, 
          digital forensics, and enterprise security. Stay tuned!
        </p>
        
        <div className="space-y-4">
          <p className="text-slate-600">
            In the meantime, check out our comprehensive documentation and resources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnterpriseButton 
              variant="primary"
              onClick={() => window.location.href = '/docs'}
            >
              View Documentation
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </EnterpriseButton>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default Blog; 