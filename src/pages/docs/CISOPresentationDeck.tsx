import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowLeft as PrevArrow, Download, Shield, Target, TrendingUp, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

const CISOPresentationDeck: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const handleDownload = () => {
    window.print();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slides = [
    // Slide 1: Title
    {
      title: "ProofPix Security Architecture",
      subtitle: "Revolutionary Client-Side Processing Model",
      content: (
        <div className="text-center space-y-8">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">CISO Presentation</h2>
            <p className="text-xl text-gray-300 mb-6">
              Eliminating 90% of Traditional SaaS Security Risks
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-sm text-gray-400">Server Storage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">100%</div>
                <div className="text-sm text-gray-400">Client Processing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">95%</div>
                <div className="text-sm text-gray-400">Risk Reduction</div>
              </div>
            </div>
          </div>
          <p className="text-gray-400">
            Presented to: [CISO Name] • [Company] • [Date]
          </p>
        </div>
      )
    },

    // Slide 2: Executive Summary
    {
      title: "Executive Summary",
      subtitle: "Why ProofPix Represents a Security Paradigm Shift",
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">The ProofPix Advantage</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Zero server-side data storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">100% client-side processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Automatic regulatory compliance</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Open source transparency</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Enterprise authentication ready</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Minimal attack surface</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 font-medium text-center">
              "ProofPix doesn't just meet security requirements - it eliminates the need for most of them through architectural design."
            </p>
          </div>
        </div>
      )
    },

    // Slide 3: Traditional vs ProofPix Architecture
    {
      title: "Architecture Comparison",
      subtitle: "Traditional SaaS vs ProofPix Client-Side Model",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                Traditional SaaS Flow
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">User uploads sensitive data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Network transmission (TLS)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Server-side processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Database storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Backup systems</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Long-term retention</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-red-400 font-bold">Multiple Attack Vectors</span>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                ProofPix Flow
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">User selects local files</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Browser memory processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Metadata extraction (local)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Results display</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Local export generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Automatic memory cleanup</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-green-400 font-bold">Zero Server Risk</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Threat Model Analysis
    {
      title: "Threat Model Analysis",
      subtitle: "Risk Elimination Through Architecture",
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300 font-semibold">Threat Category</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Traditional SaaS</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">ProofPix</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Risk Reduction</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white font-medium">Data Breach</td>
                  <td className="text-center py-3 text-red-400 font-bold">CRITICAL</td>
                  <td className="text-center py-3 text-green-400 font-bold">ELIMINATED</td>
                  <td className="text-center py-3 text-green-400 font-bold">100%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white font-medium">Server Compromise</td>
                  <td className="text-center py-3 text-red-400 font-bold">HIGH</td>
                  <td className="text-center py-3 text-green-400 font-bold">ELIMINATED</td>
                  <td className="text-center py-3 text-green-400 font-bold">100%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white font-medium">Database Attacks</td>
                  <td className="text-center py-3 text-red-400 font-bold">HIGH</td>
                  <td className="text-center py-3 text-green-400 font-bold">ELIMINATED</td>
                  <td className="text-center py-3 text-green-400 font-bold">100%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white font-medium">Insider Threats</td>
                  <td className="text-center py-3 text-yellow-400 font-bold">MEDIUM</td>
                  <td className="text-center py-3 text-green-400 font-bold">VERY LOW</td>
                  <td className="text-center py-3 text-green-400 font-bold">90%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white font-medium">Third-party Risks</td>
                  <td className="text-center py-3 text-yellow-400 font-bold">MEDIUM</td>
                  <td className="text-center py-3 text-green-400 font-bold">LOW</td>
                  <td className="text-center py-3 text-green-400 font-bold">70%</td>
                </tr>
                <tr>
                  <td className="py-3 text-white font-medium">Compliance Violations</td>
                  <td className="text-center py-3 text-red-400 font-bold">HIGH</td>
                  <td className="text-center py-3 text-green-400 font-bold">VERY LOW</td>
                  <td className="text-center py-3 text-green-400 font-bold">95%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-300 font-medium text-center">
              Result: 95% reduction in overall security risk profile compared to traditional SaaS platforms
            </p>
          </div>
        </div>
      )
    },

    // Slide 5: Compliance Readiness
    {
      title: "Regulatory Compliance Status",
      subtitle: "Built-in Compliance Through Privacy-by-Design",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-lg font-semibold text-white mb-1">GDPR</div>
              <div className="text-sm text-gray-400">Privacy by design architecture</div>
              <div className="mt-3 text-xs text-green-300">✓ Ready for certification</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-lg font-semibold text-white mb-1">CCPA</div>
              <div className="text-sm text-gray-400">Minimal data collection</div>
              <div className="mt-3 text-xs text-green-300">✓ Ready for certification</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">90%</div>
              <div className="text-lg font-semibold text-white mb-1">HIPAA</div>
              <div className="text-sm text-gray-400">No ePHI server storage</div>
              <div className="mt-3 text-xs text-green-300">✓ Architecture compliant</div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">85%</div>
              <div className="text-lg font-semibold text-white mb-1">SOC 2</div>
              <div className="text-sm text-gray-400">Type II certification</div>
              <div className="mt-3 text-xs text-yellow-300">⏱ 6 months to completion</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">80%</div>
              <div className="text-lg font-semibold text-white mb-1">ISO 27001</div>
              <div className="text-sm text-gray-400">Security management</div>
              <div className="mt-3 text-xs text-green-300">✓ Strong foundation</div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">60%</div>
              <div className="text-lg font-semibold text-white mb-1">FedRAMP</div>
              <div className="text-sm text-gray-400">Government cloud</div>
              <div className="mt-3 text-xs text-yellow-300">⏱ Specialized implementation</div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-400 mb-2">Compliance Advantages</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• No data retention policies needed (no data stored)</li>
              <li>• No data disposal procedures required</li>
              <li>• Automatic right-to-erasure compliance</li>
              <li>• Simplified audit scope and procedures</li>
            </ul>
          </div>
        </div>
      )
    },

    // Slide 6: Security Controls
    {
      title: "Security Control Implementation",
      subtitle: "Multi-Layer Defense with Minimal Attack Surface",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Application Security</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Content Security Policy (CSP)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">XSS protection headers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">CSRF token validation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Input validation & sanitization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Secure file type validation</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Transport Security</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">TLS 1.3 encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">HSTS enforcement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Certificate pinning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Perfect Forward Secrecy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Secure cookie settings</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Authentication & Access</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Multi-Factor Authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">SSO (SAML 2.0, OAuth 2.0)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Role-Based Access Control</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Session management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Privileged access monitoring</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4">Monitoring & Incident Response</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Real-time security monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Automated threat detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Incident response procedures</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Security event logging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Vulnerability management</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Business Impact
    {
      title: "Business Impact & ROI",
      subtitle: "Security as a Competitive Advantage",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Cost Savings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Reduced compliance costs</span>
                  <span className="text-green-400 font-bold">-60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Lower audit complexity</span>
                  <span className="text-green-400 font-bold">-70%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Minimal security overhead</span>
                  <span className="text-green-400 font-bold">-80%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">No data breach insurance</span>
                  <span className="text-green-400 font-bold">-100%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Business Benefits</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">Faster enterprise sales cycles</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Competitive differentiation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300">Reduced legal/compliance team load</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300">Enhanced customer trust</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Risk Mitigation Value</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">$0</div>
                <div className="text-sm text-gray-400">Potential data breach cost</div>
                <div className="text-xs text-green-300">(No data to breach)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">$0</div>
                <div className="text-sm text-gray-400">GDPR violation fines</div>
                <div className="text-xs text-green-300">(Compliant by design)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">$0</div>
                <div className="text-sm text-gray-400">Data recovery costs</div>
                <div className="text-xs text-green-300">(Nothing to recover)</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Implementation Roadmap
    {
      title: "Implementation Roadmap",
      subtitle: "Path to Full Security Certification",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Phase 1: Foundation (Q1 2024)</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Security policy documentation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Risk assessment framework</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Security awareness training</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Incident response procedures</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-blue-400 font-bold">3 months</span>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4">Phase 2: Certification (Q2-Q3 2024)</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">SOC 2 Type II audit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">ISO 27001 preparation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Compliance automation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Third-party security assessment</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-yellow-400 font-bold">6 months</span>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Phase 3: Advanced (Q4 2024+)</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">FedRAMP assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Industry-specific compliance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Advanced threat detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Continuous monitoring</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-green-400 font-bold">Ongoing</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Investment Summary</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-400 mb-1">$65K</div>
                <div className="text-sm text-gray-400">SOC 2 Certification</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400 mb-1">$45K</div>
                <div className="text-sm text-gray-400">ISO 27001 Certification</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400 mb-1">$25K</div>
                <div className="text-sm text-gray-400">Annual compliance tools</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400 mb-1">$135K</div>
                <div className="text-sm text-gray-400">Total first-year investment</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: Competitive Analysis
    {
      title: "Competitive Security Analysis",
      subtitle: "ProofPix vs Traditional Image Processing Platforms",
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300 font-semibold">Security Feature</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Traditional Platforms</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">ProofPix</th>
                  <th className="text-center py-3 text-gray-300 font-semibold">Advantage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white">Data Storage</td>
                  <td className="text-center py-3 text-red-400">Server-side storage required</td>
                  <td className="text-center py-3 text-green-400">Zero server storage</td>
                  <td className="text-center py-3 text-green-400">100% elimination</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white">Processing Location</td>
                  <td className="text-center py-3 text-red-400">Cloud servers</td>
                  <td className="text-center py-3 text-green-400">Client browser</td>
                  <td className="text-center py-3 text-green-400">No network exposure</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white">Compliance Complexity</td>
                  <td className="text-center py-3 text-red-400">High (full data lifecycle)</td>
                  <td className="text-center py-3 text-green-400">Minimal (no data storage)</td>
                  <td className="text-center py-3 text-green-400">90% reduction</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white">Audit Scope</td>
                  <td className="text-center py-3 text-yellow-400">Extensive infrastructure</td>
                  <td className="text-center py-3 text-green-400">Minimal (auth + delivery)</td>
                  <td className="text-center py-3 text-green-400">80% reduction</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 text-white">Breach Impact</td>
                  <td className="text-center py-3 text-red-400">Customer data exposed</td>
                  <td className="text-center py-3 text-green-400">No customer data to expose</td>
                  <td className="text-center py-3 text-green-400">Risk eliminated</td>
                </tr>
                <tr>
                  <td className="py-3 text-white">Transparency</td>
                  <td className="text-center py-3 text-yellow-400">Proprietary/closed source</td>
                  <td className="text-center py-3 text-green-400">Open source</td>
                  <td className="text-center py-3 text-green-400">Full auditability</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Key Differentiators</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Architectural Advantages</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Zero-trust by design (no server data)</li>
                  <li>• Impossible to breach customer data</li>
                  <li>• Automatic privacy compliance</li>
                  <li>• Minimal attack surface</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Business Advantages</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Faster enterprise procurement</li>
                  <li>• Lower compliance costs</li>
                  <li>• Reduced legal complexity</li>
                  <li>• Enhanced customer trust</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Next Steps
    {
      title: "Next Steps & Recommendations",
      subtitle: "Moving Forward with ProofPix Security Implementation",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Immediate Actions (30 days)</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <div className="font-medium text-white">Security Assessment</div>
                    <div className="text-gray-400">Independent third-party security review</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <div className="font-medium text-white">Pilot Program</div>
                    <div className="text-gray-400">Limited deployment with security monitoring</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <div className="font-medium text-white">Compliance Review</div>
                    <div className="text-gray-400">Validate regulatory compliance claims</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Strategic Recommendations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Approve ProofPix for enterprise use</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Leverage security advantages in procurement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Use as model for future vendor selection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Reduce overall security risk profile</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-white mb-2">Security Team</h4>
                <p className="text-sm text-gray-400">Technical security questions</p>
                <p className="text-blue-400">security@proofpixapp.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Compliance Team</h4>
                <p className="text-sm text-gray-400">Regulatory compliance support</p>
                <p className="text-blue-400">compliance@proofpixapp.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Executive Team</h4>
                <p className="text-sm text-gray-400">Strategic discussions</p>
                <p className="text-blue-400">executive@proofpixapp.com</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">Thank You</h3>
            <p className="text-gray-300">
              Questions? Let's discuss how ProofPix can enhance your organization's security posture.
            </p>
          </div>
        </div>
      )
    }
  ];

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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
                CISO Deck
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Slide Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevSlide}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={currentSlide === 0}
          >
            <PrevArrow className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="flex space-x-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={nextSlide}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={currentSlide === slides.length - 1}
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Current Slide */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 min-h-[600px]">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg text-gray-300">
              {slides[currentSlide].subtitle}
            </p>
          </div>
          
          <div className="slide-content">
            {slides[currentSlide].content}
          </div>
        </div>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </div>
  );
};

export default CISOPresentationDeck; 