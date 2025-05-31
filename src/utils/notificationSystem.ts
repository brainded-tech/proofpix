import { errorHandler } from './errorHandler';

interface NotificationConfig {
  enableBrowserNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  enableInAppNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  categories: {
    security: boolean;
    compliance: boolean;
    system: boolean;
    updates: boolean;
    marketing: boolean;
  };
  urgencyLevels: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
}

interface Notification {
  id: string;
  type: 'security' | 'compliance' | 'system' | 'update' | 'marketing' | 'custom';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  actionRequired: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  expiresAt?: Date;
  userId: string;
  source: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: () => Promise<void> | void;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'security' | 'compliance' | 'system' | 'update' | 'marketing';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  titleTemplate: string;
  messageTemplate: string;
  channels: Array<'browser' | 'email' | 'sms' | 'in-app'>;
  variables: string[];
  conditions?: {
    userTier?: string[];
    timeOfDay?: { start: string; end: string };
    frequency?: 'immediate' | 'batched' | 'daily' | 'weekly';
  };
}

interface NotificationSubscription {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent: string;
  createdAt: Date;
  lastUsed?: Date;
}

class AdvancedNotificationSystem {
  private config: NotificationConfig;
  private notifications: Map<string, Notification> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private subscriptions: Map<string, NotificationSubscription[]> = new Map();
  private listeners: Map<string, Array<(notification: Notification) => void>> = new Map();
  private batchQueue: Notification[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor(config: NotificationConfig) {
    this.config = config;
    this.initializeDefaultTemplates();
    this.requestBrowserPermission();
    this.startBatchProcessor();
  }

  // Core notification methods
  async sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>): Promise<string> {
    try {
      const fullNotification: Notification = {
        ...notification,
        id: this.generateNotificationId(),
        timestamp: new Date(),
        read: false,
        dismissed: false
      };

      // Check if notification should be sent based on config
      if (!this.shouldSendNotification(fullNotification)) {
        return fullNotification.id;
      }

      // Store notification
      this.notifications.set(fullNotification.id, fullNotification);

      // Send through various channels
      await this.deliverNotification(fullNotification);

      // Trigger listeners
      this.triggerListeners(fullNotification);

      return fullNotification.id;
    } catch (error) {
      await errorHandler.handleError('notification_send', error as Error, {
        operation: 'notification_send',
        metadata: {
          notificationType: notification.type,
          urgency: notification.urgency
        }
      });
      throw error;
    }
  }

  async sendFromTemplate(templateId: string, variables: Record<string, string>, userId: string): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const title = this.interpolateTemplate(template.titleTemplate, variables);
    const message = this.interpolateTemplate(template.messageTemplate, variables);

    return this.sendNotification({
      type: template.type,
      urgency: template.urgency,
      title,
      message,
      userId,
      source: `template:${templateId}`,
      actionRequired: false
    });
  }

  private async deliverNotification(notification: Notification): Promise<void> {
    const deliveryPromises: Promise<void>[] = [];

    // In-app notification (always delivered)
    if (this.config.enableInAppNotifications) {
      deliveryPromises.push(this.deliverInApp(notification));
    }

    // Browser notification
    if (this.config.enableBrowserNotifications && this.hasBrowserPermission()) {
      deliveryPromises.push(this.deliverBrowser(notification));
    }

    // Email notification
    if (this.config.enableEmailNotifications) {
      deliveryPromises.push(this.deliverEmail(notification));
    }

    // SMS notification (for critical notifications)
    if (this.config.enableSMSNotifications && notification.urgency === 'critical') {
      deliveryPromises.push(this.deliverSMS(notification));
    }

    await Promise.allSettled(deliveryPromises);
  }

  private async deliverInApp(notification: Notification): Promise<void> {
    // In-app notifications are handled by the UI components
    // This method can trigger real-time updates via WebSocket or EventSource
    this.broadcastToUI(notification);
  }

  private async deliverBrowser(notification: Notification): Promise<void> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.urgency === 'critical',
      silent: notification.urgency === 'low',
      data: {
        notificationId: notification.id,
        type: notification.type,
        urgency: notification.urgency
      }
    });

    browserNotification.onclick = () => {
      this.handleNotificationClick(notification.id);
      browserNotification.close();
    };

    // Auto-close non-critical notifications
    if (notification.urgency !== 'critical') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  private async deliverEmail(notification: Notification): Promise<void> {
    // In a real implementation, this would call an email service
    console.log(`Email notification sent: ${notification.title}`);
    
    // Mock email delivery
    try {
      const emailData = {
        to: `user_${notification.userId}@example.com`,
        subject: `[ProofPix] ${notification.title}`,
        body: this.generateEmailBody(notification),
        priority: notification.urgency === 'critical' ? 'high' : 'normal'
      };

      // Simulate API call to email service
      await this.mockEmailService(emailData);
    } catch (error) {
      console.error('Email delivery failed:', error);
    }
  }

  private async deliverSMS(notification: Notification): Promise<void> {
    // In a real implementation, this would call an SMS service
    console.log(`SMS notification sent: ${notification.title}`);
    
    try {
      const smsData = {
        to: `+1234567890`, // Would be retrieved from user profile
        message: `ProofPix Alert: ${notification.title} - ${notification.message}`,
        priority: 'high'
      };

      // Simulate API call to SMS service
      await this.mockSMSService(smsData);
    } catch (error) {
      console.error('SMS delivery failed:', error);
    }
  }

  private shouldSendNotification(notification: Notification): boolean {
    // Check category preferences - map 'update' to 'updates'
    const categoryKey = notification.type === 'update' ? 'updates' : notification.type;
    if (!this.config.categories[categoryKey as keyof typeof this.config.categories]) {
      return false;
    }

    // Check urgency preferences
    if (!this.config.urgencyLevels[notification.urgency]) {
      return false;
    }

    // Check quiet hours
    if (this.config.quietHours.enabled && this.isInQuietHours()) {
      // Only allow critical notifications during quiet hours
      return notification.urgency === 'critical';
    }

    return true;
  }

  private isInQuietHours(): boolean {
    if (!this.config.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: this.config.quietHours.timezone 
    });

    const start = this.config.quietHours.start;
    const end = this.config.quietHours.end;

    if (start <= end) {
      return currentTime >= start && currentTime <= end;
    } else {
      // Quiet hours span midnight
      return currentTime >= start || currentTime <= end;
    }
  }

  // Notification management
  getNotifications(userId: string, options?: {
    unreadOnly?: boolean;
    type?: string;
    urgency?: string;
    limit?: number;
    offset?: number;
  }): Notification[] {
    let notifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId);

    if (options?.unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    if (options?.type) {
      notifications = notifications.filter(n => n.type === options.type);
    }

    if (options?.urgency) {
      notifications = notifications.filter(n => n.urgency === options.urgency);
    }

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    return notifications.slice(offset, offset + limit);
  }

  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  markAllAsRead(userId: string): number {
    let count = 0;
    for (const notification of this.notifications.values()) {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        count++;
      }
    }
    return count;
  }

  dismissNotification(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.dismissed = true;
      return true;
    }
    return false;
  }

  deleteNotification(notificationId: string): boolean {
    return this.notifications.delete(notificationId);
  }

  getUnreadCount(userId: string): number {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.read && !n.dismissed)
      .length;
  }

  // Template management
  addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(templateId: string): NotificationTemplate | undefined {
    return this.templates.get(templateId);
  }

  private interpolateTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  // Event listeners
  addEventListener(event: string, callback: (notification: Notification) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: (notification: Notification) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private triggerListeners(notification: Notification): void {
    const listeners = this.listeners.get('notification') || [];
    listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Notification listener error:', error);
      }
    });
  }

  // Configuration management
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  // Browser notification permission
  private async requestBrowserPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  private hasBrowserPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  // Utility methods
  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleNotificationClick(notificationId: string): void {
    this.markAsRead(notificationId);
    // Additional click handling logic
  }

  private broadcastToUI(notification: Notification): void {
    // In a real implementation, this would use WebSocket or Server-Sent Events
    window.dispatchEvent(new CustomEvent('proofpix-notification', {
      detail: notification
    }));
  }

  private generateEmailBody(notification: Notification): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 16px;">${notification.title}</h2>
            <p style="color: #666; line-height: 1.6;">${notification.message}</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                This notification was sent at ${notification.timestamp.toLocaleString()}
                <br>
                Urgency: ${notification.urgency.toUpperCase()}
                <br>
                Type: ${notification.type.toUpperCase()}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private async mockEmailService(emailData: any): Promise<void> {
    // Simulate email service delay
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Email sent:', emailData);
  }

  private async mockSMSService(smsData: any): Promise<void> {
    // Simulate SMS service delay
    await new Promise(resolve => setTimeout(resolve, 150));
    console.log('SMS sent:', smsData);
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'security_breach',
        name: 'Security Breach Alert',
        type: 'security',
        urgency: 'critical',
        titleTemplate: 'Security Breach Detected',
        messageTemplate: 'A security breach has been detected in {{fileName}}. Immediate action required.',
        channels: ['browser', 'email', 'sms', 'in-app'],
        variables: ['fileName', 'breachType', 'timestamp']
      },
      {
        id: 'compliance_violation',
        name: 'Compliance Violation',
        type: 'compliance',
        urgency: 'high',
        titleTemplate: 'Compliance Violation: {{framework}}',
        messageTemplate: 'A {{framework}} compliance violation has been detected in {{fileName}}.',
        channels: ['browser', 'email', 'in-app'],
        variables: ['framework', 'fileName', 'violationType']
      },
      {
        id: 'signature_request',
        name: 'Signature Request',
        type: 'system',
        urgency: 'medium',
        titleTemplate: 'Signature Required',
        messageTemplate: 'Your signature is required for {{documentName}}. Please review and sign.',
        channels: ['browser', 'email', 'in-app'],
        variables: ['documentName', 'requester', 'deadline']
      },
      {
        id: 'system_maintenance',
        name: 'System Maintenance',
        type: 'system',
        urgency: 'low',
        titleTemplate: 'Scheduled Maintenance',
        messageTemplate: 'System maintenance is scheduled for {{date}} at {{time}}.',
        channels: ['browser', 'email', 'in-app'],
        variables: ['date', 'time', 'duration']
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private startBatchProcessor(): void {
    // Process batched notifications every 5 minutes
    setInterval(() => {
      this.processBatchQueue();
    }, 5 * 60 * 1000);
  }

  private processBatchQueue(): void {
    if (this.batchQueue.length === 0) {
      return;
    }

    // Group notifications by user and type
    const grouped = this.batchQueue.reduce((acc, notification) => {
      const key = `${notification.userId}_${notification.type}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);

    // Send batched notifications
    Object.values(grouped).forEach(notifications => {
      this.sendBatchedNotification(notifications);
    });

    // Clear the queue
    this.batchQueue = [];
  }

  private sendBatchedNotification(notifications: Notification[]): void {
    if (notifications.length === 0) return;

    const firstNotification = notifications[0];
    const count = notifications.length;

    const batchedNotification: Notification = {
      id: this.generateNotificationId(),
      type: firstNotification.type,
      urgency: 'medium',
      title: `${count} ${firstNotification.type} notifications`,
      message: `You have ${count} new ${firstNotification.type} notifications.`,
      timestamp: new Date(),
      read: false,
      dismissed: false,
      actionRequired: false,
      userId: firstNotification.userId,
      source: 'batch_processor',
      metadata: {
        batchedNotifications: notifications.map(n => n.id),
        originalCount: count
      }
    };

    this.notifications.set(batchedNotification.id, batchedNotification);
    this.deliverNotification(batchedNotification);
  }

  // Cleanup expired notifications
  cleanupExpiredNotifications(): number {
    const now = new Date();
    let cleanedCount = 0;

    for (const [id, notification] of this.notifications.entries()) {
      if (notification.expiresAt && now > notification.expiresAt) {
        this.notifications.delete(id);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  // Export/Import for backup
  exportNotifications(userId: string): Notification[] {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId);
  }

  importNotifications(notifications: Notification[]): void {
    notifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });
  }
}

// Default configuration
const defaultConfig: NotificationConfig = {
  enableBrowserNotifications: true,
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  enableInAppNotifications: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
    timezone: 'America/New_York'
  },
  categories: {
    security: true,
    compliance: true,
    system: true,
    updates: true,
    marketing: false
  },
  urgencyLevels: {
    low: true,
    medium: true,
    high: true,
    critical: true
  }
};

// Global notification system instance
export const notificationSystem = new AdvancedNotificationSystem(defaultConfig);

// Helper functions for common notification scenarios
export const notificationHelpers = {
  async securityAlert(userId: string, fileName: string, breachType: string) {
    return notificationSystem.sendFromTemplate('security_breach', {
      fileName,
      breachType,
      timestamp: new Date().toLocaleString()
    }, userId);
  },

  async complianceViolation(userId: string, framework: string, fileName: string, violationType: string) {
    return notificationSystem.sendFromTemplate('compliance_violation', {
      framework,
      fileName,
      violationType
    }, userId);
  },

  async signatureRequest(userId: string, documentName: string, requester: string, deadline: string) {
    return notificationSystem.sendFromTemplate('signature_request', {
      documentName,
      requester,
      deadline
    }, userId);
  },

  async systemMaintenance(userId: string, date: string, time: string, duration: string) {
    return notificationSystem.sendFromTemplate('system_maintenance', {
      date,
      time,
      duration
    }, userId);
  },

  async customNotification(
    userId: string, 
    type: 'security' | 'compliance' | 'system' | 'update' | 'marketing',
    urgency: 'low' | 'medium' | 'high' | 'critical',
    title: string,
    message: string,
    actions?: NotificationAction[]
  ) {
    return notificationSystem.sendNotification({
      type,
      urgency,
      title,
      message,
      userId,
      source: 'custom',
      actionRequired: !!actions,
      actions
    });
  }
};

export default notificationSystem; 