interface RealTimeEvent {
  type: 'document_processing' | 'analysis_complete' | 'error' | 'progress_update' | 'insight_generated';
  data: any;
  timestamp: Date;
  documentId?: string;
}

interface ProcessingUpdate {
  documentId: string;
  progress: number;
  status: 'processing' | 'completed' | 'failed';
  stage: string;
  estimatedTimeRemaining?: number;
}

interface AnalysisResult {
  documentId: string;
  results: any;
  confidence: number;
  processingTime: number;
}

class RealTimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(event: RealTimeEvent) => void>> = new Map();
  private isConnected = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo purposes, we'll simulate the connection
      this.simulateConnection();
    } catch (error) {
      console.error('Failed to connect to real-time service:', error);
      this.scheduleReconnect();
    }
  }

  private simulateConnection() {
    // Simulate WebSocket connection for demo
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Emit connection event
    this.emit('connection', { connected: true });
    
    console.log('Real-time service connected (simulated)');
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        // Simulate heartbeat
        this.emit('heartbeat', { timestamp: new Date() });
      }
    }, 30000); // 30 seconds
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  public subscribe(eventType: string, callback: (event: RealTimeEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  private emit(eventType: string, data: any) {
    const event: RealTimeEvent = {
      type: eventType as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in real-time event listener:', error);
        }
      });
    }
  }

  public sendProcessingUpdate(update: ProcessingUpdate) {
    this.emit('document_processing', update);
  }

  public sendAnalysisComplete(result: AnalysisResult) {
    this.emit('analysis_complete', result);
  }

  public sendError(error: { message: string; documentId?: string }) {
    this.emit('error', error);
  }

  public sendProgressUpdate(documentId: string, progress: number, stage: string) {
    this.emit('progress_update', {
      documentId,
      progress,
      stage,
      timestamp: new Date()
    });
  }

  public sendInsightGenerated(insight: any) {
    this.emit('insight_generated', insight);
  }

  // Simulate real-time processing updates
  public simulateDocumentProcessing(documentId: string) {
    const stages = [
      { name: 'Uploading', progress: 10 },
      { name: 'OCR Processing', progress: 30 },
      { name: 'Entity Extraction', progress: 50 },
      { name: 'Classification', progress: 70 },
      { name: 'Privacy Analysis', progress: 85 },
      { name: 'Generating Insights', progress: 95 },
      { name: 'Complete', progress: 100 }
    ];

    let currentStage = 0;

    const processNextStage = () => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        this.sendProgressUpdate(documentId, stage.progress, stage.name);
        
        if (stage.progress === 100) {
          // Simulate completion
          setTimeout(() => {
            this.sendAnalysisComplete({
              documentId,
              results: {
                ocrText: 'Simulated OCR text...',
                entities: [],
                classification: { type: 'document', confidence: 0.95 }
              },
              confidence: 0.95,
              processingTime: 2500
            });
          }, 500);
        } else {
          // Continue to next stage
          setTimeout(() => {
            currentStage++;
            processNextStage();
          }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
        }
      }
    };

    // Start processing simulation
    setTimeout(processNextStage, 100);
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.listeners.clear();
  }

  // Analytics and monitoring
  public getMetrics() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      activeListeners: Array.from(this.listeners.entries()).map(([type, listeners]) => ({
        type,
        count: listeners.size
      })),
      uptime: this.isConnected ? Date.now() : 0
    };
  }
}

// Export singleton instance
export const realTimeService = new RealTimeService();
export default realTimeService; 