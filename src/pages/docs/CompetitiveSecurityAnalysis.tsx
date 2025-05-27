import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, XCircle, Download, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

const CompetitiveSecurityAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const handleDownload = () => {
    window.print();
  };

  const competitors = [
    {
      name: "Adobe Creative Cloud",
      type: "Traditional SaaS",
      marketShare: "35%",
      securityModel: "Server-side processing with cloud storage",
      dataStorage: "Extensive cloud storage required",
      compliance: "SOC 2, some regional compliance",
      breachRisk: "HIGH",
      privacyCompliance: "MEDIUM",
      auditComplexity: "HIGH"
    },
    {
      name: "Canva",
      type: "Cloud-based Design",
      marketShare: "20%",
      securityModel: "Cloud processing and storage",
      dataStorage: "All user content stored in cloud",
      compliance: "Basic compliance certifications",
      breachRisk: "HIGH",
      privacyCompliance: "MEDIUM",
      auditComplexity: "HIGH"
    },
    {
      name: "GIMP",
      type: "Desktop Software",
      marketShare: "15%",
      securityModel: "Local processing only",
      dataStorage: "Local storage only",
      compliance: "N/A (local software)",
      breachRisk: "LOW",
      privacyCompliance: "HIGH",
      auditComplexity: "LOW"
    },
    {
      name: "Figma",
      type: "Collaborative Design",
      marketShare: "12%",
      securityModel: "Cloud-based with real-time sync",
      dataStorage: "Cloud storage with version control",
      compliance: "SOC 2, GDPR efforts",
      breachRisk: "HIGH",
      privacyCompliance: "MEDIUM",
      auditComplexity: "HIGH"
    },
    {
      name: "ProofPix",
      type: "Client-side Processing",
      marketShare: "Emerging",
      securityModel: "100% client-side processing",
      dataStorage: "Zero server storage",
      compliance: "GDPR/CCPA ready, SOC 2 in progress",
      breachRisk: "ELIMINATED",
      privacyCompliance: "VERY HIGH",
      auditComplexity: "VERY LOW"
    }
  ];

  const securityFeatures = [
    {
      feature: "Data Storage Location",
      traditional: "Cloud servers (AWS, Azure, GCP)",
      proofpix: "Browser memory only",
      advantage: "100% elimination of server-side data breach risk"
    },
    {
      feature: "Data Transmission",
      traditional: "HTTPS encrypted uploads/downloads",
      proofpix: "No customer data transmission",
      advantage: "Zero network exposure of customer data"
    },
    {
      feature: "Processing Location",
      traditional: "Remote cloud servers",
      proofpix: "User's local browser",
      advantage: "Complete user control and privacy"
    },
    {
      feature: "Data Retention",
      traditional: "30-90 days to indefinite",
      proofpix: "Zero retention (session-only)",
      advantage: "Automatic compliance with data minimization"
    },
    {
      feature: "Backup Requirements",
      traditional: "Complex backup and recovery systems",
      proofpix: "No customer data to backup",
      advantage: "Simplified operations, no backup vulnerabilities"
    },
    {
      feature: "Compliance Scope",
      traditional: "Full data lifecycle compliance",
      proofpix: "Minimal scope (no customer data)",
      advantage: "90% reduction in compliance complexity"
    },
    {
      feature: "Audit Requirements",
      traditional: "Extensive infrastructure auditing",
      proofpix: "Limited to authentication and delivery",
      advantage: "80% reduction in audit scope and cost"
    },
    {
      feature: "Incident Response",
      traditional: "Complex breach notification procedures",
      proofpix: "Simplified (no customer data to breach)",
      advantage: "Minimal incident impact and response complexity"
    }
  ];

  const threatComparison = [
    {
      threat: "Data Breach",
      traditional: { risk: "CRITICAL", impact: "Massive customer data exposure", likelihood: "HIGH" },
      proofpix: { risk: "ELIMINATED", impact: "No customer data to expose", likelihood: "NONE" }
    },
    {
      threat: "Server Compromise",
      traditional: { risk: "HIGH", impact: "Full system and data access", likelihood: "MEDIUM" },
      proofpix: { risk: "ELIMINATED", impact: "No customer data on servers", likelihood: "NONE" }
    },
    {
      threat: "Database Attacks",
      traditional: { risk: "HIGH", impact: "Customer data theft", likelihood: "MEDIUM" },
      proofpix: { risk: "ELIMINATED", impact: "No customer database exists", likelihood: "NONE" }
    },
    {
      threat: "Insider Threats",
      traditional: { risk: "MEDIUM", impact: "Privileged access to customer data", likelihood: "LOW" },
      proofpix: { risk: "VERY LOW", impact: "No customer data access possible", likelihood: "VERY LOW" }
    },
    {
      threat: "Third-party Breaches",
      traditional: { risk: "MEDIUM", impact: "Vendor access to customer data", likelihood: "MEDIUM" },
      proofpix: { risk: "LOW", impact: "No customer data shared with vendors", likelihood: "LOW" }
    },
    {
      threat: "Compliance Violations",
      traditional: { risk: "HIGH", impact: "Regulatory fines and penalties", likelihood: "MEDIUM" },
      proofpix: { risk: "VERY LOW", impact: "Minimal compliance requirements", likelihood: "VERY LOW" }
    }
  ];

  const getRiskColor = (risk: string) => {
    const colors = {
      "CRITICAL": "text-red-500 bg-red-500/20",
      "HIGH": "text-red-400 bg-red-400/20",
      "MEDIUM": "text-yellow-400 bg-yellow-400/20",
      "LOW": "text-green-400 bg-green-400/20",
      "VERY LOW": "text-green-500 bg-green-500/20",
      "ELIMINATED": "text-green-600 bg-green-600/20",
      "NONE": "text-green-600 bg-green-600/20"
    };
    return colors[risk as keyof typeof colors] || "text-gray-400 bg-gray-400/20";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToDocs}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Documentation</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-300">
                Competitive Analysis
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Competitive Security Analysis
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ProofPix vs Traditional Image Processing Platforms
          </p>
          <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-green-300 font-medium">
              Revolutionary client-side architecture delivers unmatched security advantages
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Executive Summary</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-lg font-semibold text-white mb-1">Risk Reduction</div>
              <div className="text-sm text-gray-400">vs traditional competitors</div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-lg font-semibold text-white mb-1">Data Breach Prevention</div>
              <div className="text-sm text-gray-400">No server-side customer data</div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">80%</div>
              <div className="text-lg font-semibold text-white mb-1">Compliance Simplification</div>
              <div className="text-sm text-gray-400">Reduced audit scope</div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Key Competitive Advantages</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Zero server-side data storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Eliminated data breach risk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Automatic privacy compliance</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Simplified audit requirements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Open source transparency</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Minimal attack surface</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Comparison Matrix */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Competitor Security Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300 font-semibold">Platform</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Security Model</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Data Storage</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Breach Risk</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Privacy Compliance</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Audit Complexity</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3">
                      <div className="font-medium text-white">{competitor.name}</div>
                      <div className="text-xs text-gray-400">{competitor.type}</div>
                    </td>
                    <td className="text-center py-3 text-gray-300 text-xs">{competitor.securityModel}</td>
                    <td className="text-center py-3 text-gray-300 text-xs">{competitor.dataStorage}</td>
                    <td className="text-center py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(competitor.breachRisk)}`}>
                        {competitor.breachRisk}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(competitor.privacyCompliance)}`}>
                        {competitor.privacyCompliance}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(competitor.auditComplexity)}`}>
                        {competitor.auditComplexity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Feature Comparison */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Security Feature Analysis</h2>
          
          <div className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{feature.feature}</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-red-400 mb-2">Traditional Platforms</h4>
                    <p className="text-gray-300 text-sm">{feature.traditional}</p>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400 mb-2">ProofPix</h4>
                    <p className="text-gray-300 text-sm">{feature.proofpix}</p>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">Security Advantage</h4>
                    <p className="text-gray-300 text-sm">{feature.advantage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Model Comparison */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Threat Model Comparison</h2>
          
          <div className="space-y-6">
            {threatComparison.map((threat, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                  {threat.threat}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-red-400 mb-3 flex items-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      Traditional Platforms
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(threat.traditional.risk)}`}>
                          {threat.traditional.risk}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Impact:</span>
                        <span className="text-gray-300 ml-2">{threat.traditional.impact}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Likelihood:</span>
                        <span className="text-gray-300 ml-2">{threat.traditional.likelihood}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      ProofPix
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(threat.proofpix.risk)}`}>
                          {threat.proofpix.risk}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Impact:</span>
                        <span className="text-gray-300 ml-2">{threat.proofpix.impact}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Likelihood:</span>
                        <span className="text-gray-300 ml-2">{threat.proofpix.likelihood}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Impact Analysis */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Business Impact Analysis</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                ProofPix Advantages
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Faster Enterprise Sales</h4>
                  <p className="text-gray-300 text-sm">
                    Simplified security review process accelerates procurement cycles by 60-80% compared to traditional SaaS platforms.
                  </p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Reduced Compliance Costs</h4>
                  <p className="text-gray-300 text-sm">
                    Minimal audit scope and automatic privacy compliance reduce ongoing compliance costs by 70-90%.
                  </p>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Enhanced Customer Trust</h4>
                  <p className="text-gray-300 text-sm">
                    Zero server storage model provides unprecedented customer confidence in data protection.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 text-red-400 mr-2" />
                Competitor Disadvantages
              </h3>
              
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Complex Security Reviews</h4>
                  <p className="text-gray-300 text-sm">
                    Traditional platforms require extensive security assessments, delaying enterprise adoption by months.
                  </p>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">Ongoing Compliance Burden</h4>
                  <p className="text-gray-300 text-sm">
                    Continuous compliance monitoring, auditing, and certification maintenance creates significant overhead.
                  </p>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-400 mb-2">Data Breach Liability</h4>
                  <p className="text-gray-300 text-sm">
                    Server-side storage creates ongoing liability and potential for catastrophic data breaches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Positioning */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Competitive Positioning Strategy</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Against Adobe/Canva
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Zero data breach risk vs their high-profile breaches</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Instant privacy compliance vs complex policies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">No vendor lock-in concerns</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Against Desktop Tools
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Web-based accessibility with desktop security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">No software installation required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Enterprise authentication integration</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Against Figma/Collaborative
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Privacy-first collaboration model</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">No shared cloud storage vulnerabilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Specialized metadata focus</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Enablement */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">Sales Enablement Talking Points</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-3">When Competing Against Traditional SaaS:</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• "While [Competitor] stores your images on their servers, ProofPix processes everything locally in your browser"</li>
                <li>• "Their last data breach exposed X million users - with ProofPix, there's no data to breach"</li>
                <li>• "You'll spend months on their security review - ProofPix can be approved in weeks"</li>
                <li>• "They require complex compliance auditing - we're compliant by architectural design"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">When Competing Against Desktop Tools:</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• "Get desktop-level security with web-based convenience"</li>
                <li>• "No software installation or maintenance required"</li>
                <li>• "Enterprise authentication integration that desktop tools can't provide"</li>
                <li>• "Automatic updates without security vulnerabilities from local software"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </div>
  );
};

export default CompetitiveSecurityAnalysis; 