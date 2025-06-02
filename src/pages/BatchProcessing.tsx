import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Layers,
  Upload,
  Download,
  FileImage,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  Building2,
  Star,
  Sparkles,
  Play,
  Eye,
  Settings,
  Filter,
  Grid,
  List,
  Pause,
  SkipForward,
  AlertCircle,
  Info,
  Scale,
  Heart,
  FileText,
  Camera,
  MapPin,
  Share2,
  AlertTriangle,
  Award,
  Target,
  Search
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ConsistentLayout } from '../components/ui/ConsistentLayout';

interface ProcessedImage {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  metadata?: any;
  thumbnail?: string;
}

const BatchProcessing: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'error'>('all');

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: ProcessedImage[] = acceptedFiles.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      thumbnail: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.heic', '.heif']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const startBatchProcessing = () => {
    setIsProcessing(true);
    
    // Simulate batch processing
    images.forEach((image, index) => {
      setTimeout(() => {
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, status: 'processing' as const }
            : img
        ));
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setImages(prev => prev.map(img => {
            if (img.id === image.id && img.status === 'processing') {
              const newProgress = Math.min(img.progress + 10, 100);
              if (newProgress === 100) {
                clearInterval(progressInterval);
                return { ...img, status: 'completed' as const, progress: 100 };
              }
              return { ...img, progress: newProgress };
            }
            return img;
          }));
        }, 200);
        
      }, index * 500);
    });
    
    setTimeout(() => {
      setIsProcessing(false);
    }, images.length * 500 + 3000);
  };

  const clearAll = () => {
    setImages([]);
    setIsProcessing(false);
  };

  const filteredImages = images.filter(img => filter === 'all' || img.status === filter);

  const features = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Parallel Processing",
      description: "Process multiple images simultaneously with our advanced multi-threaded engine.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized algorithms ensure maximum speed without compromising accuracy.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy Protected",
      description: "All processing happens locally - your images never leave your device.",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Real-time progress monitoring with detailed status for each image.",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const useCases = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Real Estate",
      description: "Process entire property photo sets for listings and documentation.",
      stats: "Up to 500 images"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Event Photography",
      description: "Analyze metadata from large event photo collections efficiently.",
      stats: "Batch processing"
    },
    {
      icon: <FileImage className="w-6 h-6" />,
      title: "Digital Forensics",
      description: "Process evidence collections with forensic-grade accuracy.",
      stats: "Chain of custody"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time-Critical Projects",
      description: "Meet tight deadlines with rapid batch processing capabilities.",
      stats: "< 2s per image"
    }
  ];

  return (
    <ConsistentLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 pp-hero-section">
        <div className="pp-container">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center space-x-2 bg-purple-500/10 px-6 py-3 rounded-full mb-8 border border-purple-500/20"
            >
              <Layers className="w-5 h-5 text-purple-400" />
              <span className="pp-text-caption text-purple-400 font-medium">BATCH PROCESSING</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="pp-text-display-lg mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Process Hundreds of Images
              </span>
              <br />
              <span className="text-white">In Minutes, Not Hours</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="pp-text-body-xl text-slate-300 mb-12 leading-relaxed"
            >
              Our advanced batch processing engine handles multiple images simultaneously while maintaining 
              complete privacy and forensic-grade accuracy. Perfect for professionals dealing with large image collections.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button 
                onClick={() => document.getElementById('batch-processor')?.scrollIntoView({ behavior: 'smooth' })}
                className="pp-btn pp-btn-primary pp-btn-xl group"
              >
                <Upload className="w-5 h-5 group-hover:animate-bounce" />
                Try Batch Processing
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
            <h2 className="pp-text-display-md mb-6">Powerful Batch Processing Features</h2>
            <p className="pp-text-body-lg text-slate-400 max-w-3xl mx-auto">
              Advanced capabilities designed to handle large-scale image processing with enterprise-grade performance.
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

      {/* Interactive Batch Processor */}
      <section id="batch-processor" className="py-20 bg-slate-900">
        <div className="pp-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="pp-text-display-md mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Interactive Batch Processor
                </span>
              </h2>
              <p className="pp-text-body-lg text-slate-400">
                Upload multiple images and watch them process in real-time with complete privacy protection.
              </p>
            </div>

            <div className="pp-card pp-card-glass p-8">
              {/* Upload Area */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                <h3 className="pp-text-heading-lg mb-4">
                  {isDragActive ? 'Drop images here...' : 'Upload Images for Batch Processing'}
                </h3>
                <p className="pp-text-body-md text-slate-400 mb-6">
                  Drag and drop multiple images or click to select files. Supports JPEG, PNG, TIFF, HEIC, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                  <span>• Up to 100 images</span>
                  <span>• 50MB max per file</span>
                  <span>• 100% local processing</span>
                </div>
              </div>

              {/* Controls */}
              {images.length > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={startBatchProcessing}
                      disabled={isProcessing}
                      className="pp-btn pp-btn-primary pp-btn-md disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start Processing
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={clearAll}
                      className="pp-btn pp-btn-outline pp-btn-md"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-400" />
                      <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="all">All ({images.length})</option>
                        <option value="pending">Pending ({images.filter(i => i.status === 'pending').length})</option>
                        <option value="processing">Processing ({images.filter(i => i.status === 'processing').length})</option>
                        <option value="completed">Completed ({images.filter(i => i.status === 'completed').length})</option>
                        <option value="error">Error ({images.filter(i => i.status === 'error').length})</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Grid/List */}
              {filteredImages.length > 0 && (
                <div className={`mt-8 ${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
                  {filteredImages.map((image) => (
                    <div key={image.id} className={`pp-card p-4 ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                      {image.thumbnail && (
                        <img 
                          src={image.thumbnail} 
                          alt={image.name}
                          className={`rounded-lg object-cover ${viewMode === 'grid' ? 'w-full h-32' : 'w-16 h-16'}`}
                        />
                      )}
                      
                      <div className={`${viewMode === 'grid' ? 'mt-3' : 'flex-1'}`}>
                        <h4 className="font-medium text-sm truncate">{image.name}</h4>
                        <p className="text-xs text-slate-400">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                        
                        <div className="mt-2 flex items-center gap-2">
                          {image.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                          {image.status === 'processing' && <Settings className="w-4 h-4 text-blue-400 animate-spin" />}
                          {image.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                          {image.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                          
                          <span className="text-xs capitalize">{image.status}</span>
                        </div>
                        
                        {image.status === 'processing' && (
                          <div className="mt-2 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${image.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="mt-8 text-center py-12">
                  <FileImage className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No images uploaded yet. Add some images to get started!</p>
                </div>
              )}
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
            <h2 className="pp-text-display-md mb-6">Perfect for Every Use Case</h2>
            <p className="pp-text-body-lg text-slate-400 max-w-3xl mx-auto">
              From real estate portfolios to digital forensics, our batch processing handles any scale.
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
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-emerald-400">{useCase.icon}</span>
                </div>
                
                <h3 className="pp-text-heading-sm mb-3">{useCase.title}</h3>
                <p className="pp-text-body-sm text-slate-400 mb-4 leading-relaxed">{useCase.description}</p>
                
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
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
              Ready to process images at 
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                enterprise scale?
              </span>
            </h2>
            
            <p className="pp-text-body-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who trust ProofPix for large-scale image processing with complete privacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/" className="pp-btn pp-btn-primary pp-btn-xl">
                <Upload className="w-5 h-5" />
                Start Batch Processing
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

export default BatchProcessing; 