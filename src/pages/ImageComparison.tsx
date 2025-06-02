import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Zap, 
  Eye,
  Star,
  Users,
  Building2,
  Scale,
  Heart,
  FileText,
  Camera,
  Clock,
  MapPin,
  Settings,
  Download,
  Share2,
  AlertTriangle,
  Award,
  Target,
  Sparkles,
  GitCompareArrows,
  Play,
  BarChart3,
  Fingerprint,
  Search
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ConsistentLayout } from '../components/ui/ConsistentLayout';

interface ComparisonImage {
  id: string;
  name: string;
  size: number;
  file: File;
  thumbnail: string;
  metadata?: any;
}

const ImageComparison: React.FC = () => {
  const [leftImage, setLeftImage] = useState<ComparisonImage | null>(null);
  const [rightImage, setRightImage] = useState<ComparisonImage | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'metadata' | 'technical'>('visual');

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const onDropLeft = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setLeftImage({
        id: `left-${Date.now()}`,
        name: file.name,
        size: file.size,
        file,
        thumbnail: URL.createObjectURL(file)
      });
    }
  }, []);

  const onDropRight = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setRightImage({
        id: `right-${Date.now()}`,
        name: file.name,
        size: file.size,
        file,
        thumbnail: URL.createObjectURL(file)
      });
    }
  }, []);

  const { getRootProps: getLeftRootProps, getInputProps: getLeftInputProps, isDragActive: isLeftDragActive } = useDropzone({
    onDrop: onDropLeft,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.heic', '.heif']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024
  });

  const { getRootProps: getRightRootProps, getInputProps: getRightInputProps, isDragActive: isRightDragActive } = useDropzone({
    onDrop: onDropRight,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.heic', '.heif']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024
  });

  const startComparison = () => {
    if (!leftImage || !rightImage) return;
    
    setIsComparing(true);
    
    // Simulate comparison analysis
    setTimeout(() => {
      setComparisonResults({
        similarity: 87.3,
        differences: [
          { type: 'timestamp', description: 'Images taken 2 hours apart', severity: 'medium' },
          { type: 'location', description: 'GPS coordinates differ by 0.5km', severity: 'high' },
          { type: 'camera', description: 'Same camera model detected', severity: 'low' },
          { type: 'editing', description: 'Right image shows signs of editing', severity: 'high' }
        ],
        metadata: {
          left: {
            camera: 'iPhone 14 Pro',
            timestamp: '2024-01-15 14:30:22',
            gps: '40.7128, -74.0060',
            resolution: '4032x3024',
            fileSize: '3.2 MB'
          },
          right: {
            camera: 'iPhone 14 Pro',
            timestamp: '2024-01-15 16:45:18',
            gps: '40.7180, -74.0100',
            resolution: '4032x3024',
            fileSize: '2.8 MB'
          }
        }
      });
      setIsComparing(false);
    }, 3000);
  };

  const clearComparison = () => {
    setLeftImage(null);
    setRightImage(null);
    setComparisonResults(null);
    setIsComparing(false);
  };

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Side-by-Side Analysis",
      description: "Compare images visually with synchronized zoom and pan controls for detailed examination.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Metadata Comparison",
      description: "Detailed comparison of EXIF data, timestamps, GPS coordinates, and technical specifications.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Authenticity Verification",
      description: "Detect signs of editing, manipulation, or tampering with advanced forensic algorithms.",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Difference Detection",
      description: "Automatically highlight visual differences and inconsistencies between images.",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const useCases = [
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Legal Evidence",
      description: "Compare evidence photos to detect tampering or verify authenticity in legal proceedings.",
      stats: "Court-ready reports"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Insurance Claims",
      description: "Verify claim photos against reference images to detect fraud or inconsistencies.",
      stats: "Fraud detection"
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Real Estate",
      description: "Compare property photos across time to verify condition and document changes.",
      stats: "Property verification"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Digital Forensics",
      description: "Forensic-grade comparison for investigating digital evidence and image authenticity.",
      stats: "Forensic analysis"
    }
  ];

  return (
    <ConsistentLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 pp-hero-section bg-slate-900 text-white">
        <div className="pp-container">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center space-x-2 bg-orange-500/10 px-6 py-3 rounded-full mb-8 border border-orange-500/20"
            >
              <GitCompareArrows className="w-5 h-5 text-orange-400" />
              <span className="pp-text-caption text-orange-400 font-medium">IMAGE COMPARISON</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="pp-text-display-lg mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                Compare Images with
              </span>
              <br />
              <span className="text-white">Forensic Precision</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="pp-text-body-xl text-slate-300 mb-12 leading-relaxed"
            >
              Advanced side-by-side image comparison with metadata analysis, authenticity verification, 
              and difference detection. Perfect for legal, insurance, and forensic applications.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button 
                onClick={() => document.getElementById('comparison-tool')?.scrollIntoView({ behavior: 'smooth' })}
                className="pp-btn pp-btn-primary pp-btn-xl group"
              >
                <GitCompareArrows className="w-5 h-5 group-hover:animate-pulse" />
                Try Image Comparison
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link to="/enterprise/demo" className="pp-btn pp-btn-outline pp-btn-xl group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="pp-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="pp-text-display-md mb-6">Advanced Comparison Features</h2>
            <p className="pp-text-body-lg text-slate-400 max-w-3xl mx-auto">
              Professional-grade image comparison tools designed for accuracy, reliability, and forensic applications.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative pp-card pp-card-glass p-8 text-center group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-white">{feature.icon}</span>
                </div>
                
                <h3 className="pp-text-heading-md mb-4 relative z-10">{feature.title}</h3>
                <p className="pp-text-body-md text-slate-400 leading-relaxed relative z-10">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Comparison Tool */}
      <section id="comparison-tool" className="py-20 bg-slate-900">
        <div className="pp-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="pp-text-display-md mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Interactive Comparison Tool
                </span>
              </h2>
              <p className="pp-text-body-lg text-slate-400">
                Upload two images and compare them side-by-side with detailed analysis and metadata comparison.
              </p>
            </div>

            <div className="pp-card pp-card-glass p-8">
              {/* Upload Areas */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left Image Upload */}
                <div>
                  <h3 className="pp-text-heading-sm mb-4 text-center">Image A</h3>
                  <div 
                    {...getLeftRootProps()} 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer min-h-[300px] flex flex-col items-center justify-center ${
                      isLeftDragActive 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                    }`}
                  >
                    <input {...getLeftInputProps()} />
                    {leftImage ? (
                      <div className="w-full">
                        <img 
                          src={leftImage.thumbnail} 
                          alt={leftImage.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-sm font-medium truncate">{leftImage.name}</p>
                        <p className="text-xs text-slate-400">{(leftImage.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="pp-text-body-md text-slate-400 mb-2">
                          {isLeftDragActive ? 'Drop image here...' : 'Upload first image'}
                        </p>
                        <p className="text-sm text-slate-500">Drag & drop or click to select</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Image Upload */}
                <div>
                  <h3 className="pp-text-heading-sm mb-4 text-center">Image B</h3>
                  <div 
                    {...getRightRootProps()} 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer min-h-[300px] flex flex-col items-center justify-center ${
                      isRightDragActive 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                    }`}
                  >
                    <input {...getRightInputProps()} />
                    {rightImage ? (
                      <div className="w-full">
                        <img 
                          src={rightImage.thumbnail} 
                          alt={rightImage.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-sm font-medium truncate">{rightImage.name}</p>
                        <p className="text-xs text-slate-400">{(rightImage.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="pp-text-body-md text-slate-400 mb-2">
                          {isRightDragActive ? 'Drop image here...' : 'Upload second image'}
                        </p>
                        <p className="text-sm text-slate-500">Drag & drop or click to select</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              {leftImage && rightImage && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <button
                    onClick={startComparison}
                    disabled={isComparing}
                    className="pp-btn pp-btn-primary pp-btn-lg disabled:opacity-50"
                  >
                    {isComparing ? (
                      <>
                        <Settings className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <GitCompareArrows className="w-5 h-5" />
                        Start Comparison
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={clearComparison}
                    className="pp-btn pp-btn-outline pp-btn-lg"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Comparison Results */}
              {comparisonResults && (
                <div className="space-y-8">
                  {/* Similarity Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 mb-4">
                      <div className="text-3xl font-bold text-white">
                        {comparisonResults.similarity}%
                      </div>
                    </div>
                    <h3 className="pp-text-heading-lg mb-2">Similarity Score</h3>
                    <p className="text-slate-400">Overall similarity between the two images</p>
                  </div>

                  {/* Tabs */}
                  <div className="flex justify-center">
                    <div className="flex bg-slate-800 rounded-lg p-1">
                      {[
                        { id: 'visual', label: 'Visual Analysis', icon: <Eye className="w-4 h-4" /> },
                        { id: 'metadata', label: 'Metadata', icon: <BarChart3 className="w-4 h-4" /> },
                        { id: 'technical', label: 'Technical', icon: <Settings className="w-4 h-4" /> }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            activeTab === tab.id 
                              ? 'bg-blue-600 text-white' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="pp-card p-6">
                    {activeTab === 'visual' && (
                      <div>
                        <h4 className="pp-text-heading-md mb-4">Detected Differences</h4>
                        <div className="space-y-4">
                          {comparisonResults.differences.map((diff: any, index: number) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
                              <div className={`w-3 h-3 rounded-full mt-2 ${
                                diff.severity === 'high' ? 'bg-red-500' :
                                diff.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`} />
                              <div>
                                <p className="font-medium capitalize">{diff.type}</p>
                                <p className="text-sm text-slate-400">{diff.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'metadata' && (
                      <div>
                        <h4 className="pp-text-heading-md mb-4">Metadata Comparison</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium mb-3 text-blue-400">Image A</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Camera:</span>
                                <span>{comparisonResults.metadata.left.camera}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Timestamp:</span>
                                <span>{comparisonResults.metadata.left.timestamp}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">GPS:</span>
                                <span>{comparisonResults.metadata.left.gps}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Resolution:</span>
                                <span>{comparisonResults.metadata.left.resolution}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-3 text-orange-400">Image B</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Camera:</span>
                                <span>{comparisonResults.metadata.right.camera}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Timestamp:</span>
                                <span>{comparisonResults.metadata.right.timestamp}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">GPS:</span>
                                <span>{comparisonResults.metadata.right.gps}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Resolution:</span>
                                <span>{comparisonResults.metadata.right.resolution}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'technical' && (
                      <div>
                        <h4 className="pp-text-heading-md mb-4">Technical Analysis</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <h5 className="font-medium mb-2">Authenticity Score</h5>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-700 rounded-full h-2">
                                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
                                </div>
                                <span className="text-sm">92%</span>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <h5 className="font-medium mb-2">Compression Analysis</h5>
                              <p className="text-sm text-slate-400">Both images show similar compression artifacts</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <h5 className="font-medium mb-2">Color Profile</h5>
                              <p className="text-sm text-slate-400">sRGB color space detected in both images</p>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <h5 className="font-medium mb-2">Editing Detection</h5>
                              <p className="text-sm text-slate-400">Possible editing detected in Image B</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!leftImage || !rightImage ? (
                <div className="text-center py-12">
                  <GitCompareArrows className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Upload two images to start comparing</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-slate-800/30">
        <div className="pp-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="pp-text-display-md mb-6">Professional Use Cases</h2>
            <p className="pp-text-body-lg text-slate-400 max-w-3xl mx-auto">
              Trusted by professionals across industries for accurate image comparison and verification.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className="pp-card pp-card-glass p-6"
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-orange-400">{useCase.icon}</span>
                </div>
                
                <h3 className="pp-text-heading-sm mb-3">{useCase.title}</h3>
                <p className="pp-text-body-sm text-slate-400 mb-4 leading-relaxed">{useCase.description}</p>
                
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium">
                  {useCase.stats}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pp-cta-section">
        <div className="pp-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="pp-text-display-md mb-8">
              Ready for professional-grade 
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                image comparison?
              </span>
            </h2>
            
            <p className="pp-text-body-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join professionals who trust ProofPix for accurate, reliable image comparison and verification.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/" className="pp-btn pp-btn-primary pp-btn-xl">
                <GitCompareArrows className="w-5 h-5" />
                Start Comparing Images
              </Link>
              <Link to="/pricing" className="pp-btn pp-btn-outline pp-btn-xl">
                <Eye className="w-5 h-5" />
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </ConsistentLayout>
  );
};

export default ImageComparison; 