import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  FileText, 
  Brain, 
  Lightbulb, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Eye,
  Sparkles,
  MessageSquare,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import {
  useOCR,
  useDocumentClassification,
  useFraudDetection,
  useQualityAssessment,
  usePredictiveAnalytics,
  useEntityExtraction
} from '../../hooks/useAI';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
  }>;
}

interface DocumentContext {
  fileId?: string;
  fileName?: string;
  fileType?: string;
  processingStatus?: string;
  classification?: any;
  qualityScore?: number;
  fraudRisk?: number;
}

const SmartDocumentAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI Document Assistant. I can help you with document processing, analysis, and provide intelligent insights. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Analyze this document",
        "Check for fraud",
        "Improve quality",
        "Extract information"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [documentContext, setDocumentContext] = useState<DocumentContext>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // AI Hooks
  const { performOCR, isProcessing: ocrProcessing } = useOCR();
  const { classifyDocument, isClassifying } = useDocumentClassification();
  const { detectFraud, isDetecting } = useFraudDetection();
  const { assessQuality, isAssessing } = useQualityAssessment();
  const { getPredictiveAnalytics, isAnalyzing } = usePredictiveAnalytics();
  const { extractEntities, isExtracting } = useEntityExtraction();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, type: 'user' | 'assistant', suggestions?: string[], actions?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions,
      actions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (response: string, suggestions?: string[], actions?: any[]) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    addMessage(response, 'assistant', suggestions, actions);
  };

  const processUserInput = async (input: string) => {
    addMessage(input, 'user');
    
    const lowerInput = input.toLowerCase();
    
    // Document Analysis Commands
    if (lowerInput.includes('analyze') || lowerInput.includes('process')) {
      await simulateTyping(
        "I'll analyze your document using multiple AI models. This includes OCR text extraction, document classification, quality assessment, and fraud detection.",
        ["Start analysis", "View results", "Get recommendations"],
        [
          { label: "Run Full Analysis", action: "analyze", icon: <Brain className="w-4 h-4" /> },
          { label: "Quick Scan", action: "quick-scan", icon: <Zap className="w-4 h-4" /> }
        ]
      );
    }
    
    // OCR Commands
    else if (lowerInput.includes('ocr') || lowerInput.includes('text') || lowerInput.includes('extract text')) {
      await simulateTyping(
        "I'll extract all text from your document using advanced OCR technology. This includes printed text, handwriting, and text in tables.",
        ["Extract text", "View confidence scores", "Download results"],
        [
          { label: "Start OCR", action: "ocr", icon: <Eye className="w-4 h-4" /> },
          { label: "Enhanced OCR", action: "enhanced-ocr", icon: <Sparkles className="w-4 h-4" /> }
        ]
      );
    }
    
    // Classification Commands
    else if (lowerInput.includes('classify') || lowerInput.includes('type') || lowerInput.includes('category')) {
      await simulateTyping(
        "I'll classify your document type using AI. I can identify legal documents, financial records, medical files, identity documents, and more.",
        ["Classify document", "View confidence", "Train custom model"],
        [
          { label: "Classify Now", action: "classify", icon: <FileText className="w-4 h-4" /> },
          { label: "Custom Classification", action: "custom-classify", icon: <Target className="w-4 h-4" /> }
        ]
      );
    }
    
    // Fraud Detection Commands
    else if (lowerInput.includes('fraud') || lowerInput.includes('fake') || lowerInput.includes('authentic')) {
      await simulateTyping(
        "I'll scan your document for signs of fraud, tampering, or forgery using advanced AI detection algorithms.",
        ["Check for fraud", "View risk score", "Get detailed report"],
        [
          { label: "Fraud Scan", action: "fraud", icon: <Shield className="w-4 h-4" /> },
          { label: "Deep Analysis", action: "deep-fraud", icon: <AlertCircle className="w-4 h-4" /> }
        ]
      );
    }
    
    // Quality Assessment Commands
    else if (lowerInput.includes('quality') || lowerInput.includes('improve') || lowerInput.includes('enhance')) {
      await simulateTyping(
        "I'll assess your document quality and suggest improvements. This includes clarity, resolution, lighting, and orientation analysis.",
        ["Assess quality", "Enhance image", "Get recommendations"],
        [
          { label: "Quality Check", action: "quality", icon: <CheckCircle className="w-4 h-4" /> },
          { label: "Auto Enhance", action: "enhance", icon: <Sparkles className="w-4 h-4" /> }
        ]
      );
    }
    
    // Predictive Analytics Commands
    else if (lowerInput.includes('predict') || lowerInput.includes('estimate') || lowerInput.includes('time')) {
      await simulateTyping(
        "I'll predict processing times, quality scores, and success probability for your document using historical data and AI models.",
        ["Get predictions", "View estimates", "Optimize workflow"],
        [
          { label: "Predict Processing", action: "predict", icon: <TrendingUp className="w-4 h-4" /> },
          { label: "Time Estimate", action: "estimate", icon: <Clock className="w-4 h-4" /> }
        ]
      );
    }
    
    // Help Commands
    else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      await simulateTyping(
        "I can help you with:\n\n• Document analysis and processing\n• OCR text extraction\n• Document classification\n• Fraud detection\n• Quality assessment\n• Predictive analytics\n• Smart recommendations\n\nJust ask me what you'd like to do!",
        ["Analyze document", "Extract text", "Check quality", "Detect fraud"]
      );
    }
    
    // Default Response
    else {
      await simulateTyping(
        "I understand you want to work with documents. I can analyze, classify, extract text, check for fraud, assess quality, and provide predictions. What specific task would you like me to help with?",
        ["Analyze document", "Extract text", "Check quality", "Detect fraud"],
        [
          { label: "Full Analysis", action: "analyze", icon: <Brain className="w-4 h-4" /> },
          { label: "Quick Help", action: "help", icon: <Lightbulb className="w-4 h-4" /> }
        ]
      );
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const input = inputValue;
    setInputValue('');
    await processUserInput(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'analyze':
        addMessage("Starting full document analysis...", 'assistant');
        break;
      case 'ocr':
        addMessage("Extracting text using OCR...", 'assistant');
        break;
      case 'classify':
        addMessage("Classifying document type...", 'assistant');
        break;
      case 'fraud':
        addMessage("Scanning for fraud indicators...", 'assistant');
        break;
      case 'quality':
        addMessage("Assessing document quality...", 'assistant');
        break;
      case 'predict':
        addMessage("Generating predictions...", 'assistant');
        break;
      default:
        addMessage(`Executing ${action}...`, 'assistant');
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      >
        <Bot className="w-6 h-6" />
        <div className="absolute -top-12 right-0 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">AI Assistant</h3>
            <p className="text-xs text-slate-400">Smart Document Helper</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-800 text-slate-100'
                } rounded-lg p-3`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Actions */}
                  {message.actions && (
                    <div className="mt-3 space-y-1">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action.action)}
                          className="flex items-center w-full text-left text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded transition-colors"
                        >
                          {action.icon && <span className="mr-2">{action.icon}</span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your documents..."
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 pr-10"
                />
                <button
                  onClick={toggleListening}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                    isListening ? 'text-red-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartDocumentAssistant; 