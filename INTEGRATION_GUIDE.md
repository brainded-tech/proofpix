# ProofPix Integration Guide

## 🔗 Integration Overview

This guide provides comprehensive documentation for integrating ProofPix with existing enterprise systems, third-party applications, and custom workflows.

## 🚀 Quick Start Integration

### **Basic Integration Setup**
```typescript
// Initialize ProofPix integration
const proofPixIntegration = new ProofPixIntegration({
  apiKey: 'your-api-key',
  environment: 'production', // or 'staging'
  version: '1.8.0'
});

// Basic file processing
const processFiles = async (files: File[]) => {
  const results = await proofPixIntegration.processBatch(files, {
    concurrency: 5,
    retryAttempts: 3,
    exportFormat: 'json'
  });
  
  return results;
};
```

## 📡 API Integration

### **REST API Endpoints**
```typescript
// API client configuration
class ProofPixAPIClient {
  private baseUrl = 'https://api.proofpixapp.com/v2';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  // Process single file
  async processFile(file: File): Promise<ProcessingResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseUrl}/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Client-Version': '1.8.0'
      },
      body: formData
    });
    
    return response.json();
  }
  
  // Batch processing
  async processBatch(files: File[]): Promise<BatchResult> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });
    
    return response.json();
  }
}
```

### **Webhook Integration**
```typescript
// Webhook configuration
interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

// Set up webhooks
const setupWebhooks = async (config: WebhookConfig) => {
  const response = await fetch('/api/webhooks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });
  
  return response.json();
};

// Webhook event handler
app.post('/webhook/proofpix', (req, res) => {
  const signature = req.headers['x-proofpix-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
    return res.status(401).send('Unauthorized');
  }
  
  // Handle different event types
  switch (payload.event) {
    case 'batch.completed':
      handleBatchCompleted(payload);
      break;
    case 'file.processed':
      handleFileProcessed(payload);
      break;
    default:
      console.log('Unknown event type:', payload.event);
  }
  
  res.status(200).send('OK');
});
```

## 🏢 Enterprise System Integration

### **Active Directory Integration**
```typescript
// AD authentication and user management
class ActiveDirectoryIntegration {
  private ldapClient: LDAPClient;
  
  constructor(config: ADConfig) {
    this.ldapClient = new LDAPClient(config);
  }
  
  async authenticateUser(username: string, password: string): Promise<User> {
    const user = await this.ldapClient.authenticate(username, password);
    
    // Map AD groups to ProofPix roles
    const roles = this.mapADGroupsToRoles(user.groups);
    
    return {
      id: user.sAMAccountName,
      email: user.mail,
      name: `${user.givenName} ${user.sn}`,
      department: user.department,
      roles: roles
    };
  }
  
  private mapADGroupsToRoles(groups: string[]): string[] {
    const roleMapping = {
      'ProofPix-Admins': 'admin',
      'ProofPix-Users': 'user',
      'ProofPix-Auditors': 'auditor'
    };
    
    return groups
      .filter(group => roleMapping[group])
      .map(group => roleMapping[group]);
  }
}
```

### **SharePoint Integration**
```typescript
// SharePoint file processing
class SharePointIntegration {
  private graphClient: GraphClient;
  
  constructor(clientId: string, clientSecret: string, tenantId: string) {
    this.graphClient = new GraphClient({
      clientId,
      clientSecret,
      tenantId
    });
  }
  
  async processSharePointLibrary(siteId: string, libraryId: string): Promise<BatchResult> {
    // Get files from SharePoint
    const files = await this.getFilesFromLibrary(siteId, libraryId);
    
    // Filter image files
    const imageFiles = files.filter(file => this.isImageFile(file.name));
    
    // Process files with ProofPix
    const results = await proofPixIntegration.processBatch(imageFiles);
    
    // Update SharePoint with results
    await this.updateSharePointWithResults(siteId, libraryId, results);
    
    return results;
  }
  
  private async getFilesFromLibrary(siteId: string, libraryId: string): Promise<File[]> {
    const response = await this.graphClient.api(
      `/sites/${siteId}/drives/${libraryId}/root/children`
    ).get();
    
    return response.value;
  }
}
```

### **Salesforce Integration**
```typescript
// Salesforce CRM integration
class SalesforceIntegration {
  private salesforceClient: SalesforceClient;
  
  constructor(config: SalesforceConfig) {
    this.salesforceClient = new SalesforceClient(config);
  }
  
  async processAttachments(recordId: string): Promise<void> {
    // Get attachments from Salesforce record
    const attachments = await this.salesforceClient.getAttachments(recordId);
    
    // Filter image attachments
    const imageAttachments = attachments.filter(att => this.isImageFile(att.name));
    
    // Process with ProofPix
    const results = await proofPixIntegration.processBatch(imageAttachments);
    
    // Create custom object records with results
    await this.createMetadataRecords(recordId, results);
  }
  
  private async createMetadataRecords(recordId: string, results: ProcessingResult[]): Promise<void> {
    const records = results.map(result => ({
      Related_Record__c: recordId,
      File_Name__c: result.filename,
      Privacy_Risk__c: result.privacyRisk,
      GPS_Data__c: result.hasGPS,
      Camera_Model__c: result.cameraModel,
      Processing_Date__c: new Date().toISOString()
    }));
    
    await this.salesforceClient.createRecords('Image_Metadata__c', records);
  }
}
```

## 🔄 Workflow Automation

### **Zapier Integration**
```typescript
// Zapier webhook triggers
const zapierIntegration = {
  // Trigger when batch processing completes
  onBatchComplete: async (batchResult: BatchResult) => {
    const zapierWebhook = 'https://hooks.zapier.com/hooks/catch/12345/abcdef/';
    
    await fetch(zapierWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'batch_completed',
        batch_id: batchResult.id,
        total_files: batchResult.totalFiles,
        success_rate: batchResult.successRate,
        download_url: batchResult.downloadUrl
      })
    });
  },
  
  // Trigger for high privacy risk files
  onHighPrivacyRisk: async (file: ProcessingResult) => {
    const zapierWebhook = 'https://hooks.zapier.com/hooks/catch/12345/ghijkl/';
    
    await fetch(zapierWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'high_privacy_risk',
        filename: file.filename,
        privacy_risk: file.privacyRisk,
        gps_coordinates: file.gpsCoordinates,
        recommendations: file.recommendations
      })
    });
  }
};
```

### **Microsoft Power Automate**
```typescript
// Power Automate flow configuration
const powerAutomateFlow = {
  trigger: {
    type: 'http_request',
    schema: {
      type: 'object',
      properties: {
        event: { type: 'string' },
        data: { type: 'object' }
      }
    }
  },
  
  actions: {
    // Condition: Check if high privacy risk
    condition: {
      type: 'condition',
      expression: "@equals(triggerBody()?['data']?['privacyRisk'], 'high')"
    },
    
    // Yes branch: Send Teams notification
    sendTeamsNotification: {
      type: 'teams_post_message',
      inputs: {
        recipient: 'security-team@company.com',
        subject: 'High Privacy Risk File Detected',
        message: 'File @{triggerBody()?[\'data\']?[\'filename\']} contains high privacy risk metadata.'
      }
    },
    
    // Create SharePoint list item
    createListItem: {
      type: 'sharepoint_create_item',
      inputs: {
        site: 'https://company.sharepoint.com/sites/security',
        list: 'Privacy Risk Files',
        item: {
          FileName: "@triggerBody()?['data']?['filename']",
          PrivacyRisk: "@triggerBody()?['data']?['privacyRisk']",
          ProcessedDate: "@utcNow()",
          Status: 'Pending Review'
        }
      }
    }
  }
};
```

## 📊 Business Intelligence Integration

### **Power BI Integration**
```typescript
// Power BI dataset integration
class PowerBIIntegration {
  private powerBIClient: PowerBIClient;
  
  constructor(config: PowerBIConfig) {
    this.powerBIClient = new PowerBIClient(config);
  }
  
  async pushMetadataToDataset(results: ProcessingResult[]): Promise<void> {
    const datasetId = 'your-dataset-id';
    const tableName = 'ImageMetadata';
    
    // Transform results for Power BI
    const rows = results.map(result => ({
      FileName: result.filename,
      ProcessedDate: new Date().toISOString(),
      PrivacyRisk: result.privacyRisk,
      HasGPS: result.hasGPS,
      CameraModel: result.cameraModel,
      FileSize: result.fileSize,
      ProcessingTime: result.processingTime
    }));
    
    // Push to Power BI dataset
    await this.powerBIClient.datasets.postRows(datasetId, tableName, rows);
  }
  
  async createDashboard(): Promise<string> {
    const dashboard = await this.powerBIClient.dashboards.create({
      name: 'ProofPix Analytics Dashboard'
    });
    
    // Add tiles for key metrics
    await this.addMetricsTiles(dashboard.id);
    
    return dashboard.id;
  }
}
```

### **Tableau Integration**
```typescript
// Tableau data source integration
class TableauIntegration {
  private tableauClient: TableauClient;
  
  constructor(config: TableauConfig) {
    this.tableauClient = new TableauClient(config);
  }
  
  async publishDataSource(results: ProcessingResult[]): Promise<void> {
    // Convert results to Tableau data extract
    const extract = this.createTableauExtract(results);
    
    // Publish to Tableau Server
    await this.tableauClient.publishDataSource({
      name: 'ProofPix Metadata Analysis',
      extract: extract,
      project: 'Analytics'
    });
  }
  
  private createTableauExtract(results: ProcessingResult[]): TableauExtract {
    const extract = new TableauExtract();
    
    // Define schema
    extract.addColumn('FileName', 'string');
    extract.addColumn('ProcessedDate', 'datetime');
    extract.addColumn('PrivacyRisk', 'string');
    extract.addColumn('HasGPS', 'boolean');
    extract.addColumn('CameraModel', 'string');
    
    // Add data rows
    results.forEach(result => {
      extract.addRow([
        result.filename,
        new Date(),
        result.privacyRisk,
        result.hasGPS,
        result.cameraModel
      ]);
    });
    
    return extract;
  }
}
```

## 🔐 Security Integration

### **SIEM Integration**
```typescript
// Security Information and Event Management integration
class SIEMIntegration {
  private syslogClient: SyslogClient;
  
  constructor(config: SyslogConfig) {
    this.syslogClient = new SyslogClient(config);
  }
  
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      source: 'ProofPix',
      severity: event.severity,
      event_type: event.type,
      user_id: event.userId,
      file_name: event.fileName,
      privacy_risk: event.privacyRisk,
      action_taken: event.actionTaken
    };
    
    await this.syslogClient.send(logEntry);
  }
  
  async logPrivacyRiskDetection(result: ProcessingResult): Promise<void> {
    if (result.privacyRisk === 'high') {
      await this.logSecurityEvent({
        severity: 'warning',
        type: 'privacy_risk_detected',
        userId: result.processedBy,
        fileName: result.filename,
        privacyRisk: result.privacyRisk,
        actionTaken: 'flagged_for_review'
      });
    }
  }
}
```

### **Vault Integration**
```typescript
// HashiCorp Vault integration for secrets management
class VaultIntegration {
  private vaultClient: VaultClient;
  
  constructor(config: VaultConfig) {
    this.vaultClient = new VaultClient(config);
  }
  
  async getAPIKey(): Promise<string> {
    const secret = await this.vaultClient.read('secret/proofpix/api-key');
    return secret.data.api_key;
  }
  
  async storeProcessingResults(results: ProcessingResult[]): Promise<void> {
    // Store sensitive metadata in Vault
    const sensitiveResults = results.filter(r => r.privacyRisk === 'high');
    
    for (const result of sensitiveResults) {
      await this.vaultClient.write(`secret/proofpix/results/${result.id}`, {
        filename: result.filename,
        gps_coordinates: result.gpsCoordinates,
        device_info: result.deviceInfo,
        timestamp: result.timestamp
      });
    }
  }
}
```

## 📱 Mobile Integration

### **iOS Integration**
```swift
// iOS SDK integration
import ProofPixSDK

class ProofPixManager {
    private let apiKey: String
    private let client: ProofPixClient
    
    init(apiKey: String) {
        self.apiKey = apiKey
        self.client = ProofPixClient(apiKey: apiKey)
    }
    
    func processImage(_ image: UIImage, completion: @escaping (ProcessingResult?, Error?) -> Void) {
        guard let imageData = image.jpegData(compressionQuality: 1.0) else {
            completion(nil, ProofPixError.invalidImage)
            return
        }
        
        client.processImage(imageData) { result in
            DispatchQueue.main.async {
                completion(result, nil)
            }
        }
    }
    
    func processBatch(_ images: [UIImage], completion: @escaping (BatchResult?, Error?) -> Void) {
        let imageDataArray = images.compactMap { $0.jpegData(compressionQuality: 1.0) }
        
        client.processBatch(imageDataArray) { result in
            DispatchQueue.main.async {
                completion(result, nil)
            }
        }
    }
}
```

### **Android Integration**
```kotlin
// Android SDK integration
class ProofPixManager(private val apiKey: String) {
    private val client = ProofPixClient(apiKey)
    
    suspend fun processImage(imageUri: Uri): ProcessingResult {
        val imageData = contentResolver.openInputStream(imageUri)?.readBytes()
            ?: throw IllegalArgumentException("Invalid image URI")
        
        return client.processImage(imageData)
    }
    
    suspend fun processBatch(imageUris: List<Uri>): BatchResult {
        val imageDataList = imageUris.mapNotNull { uri ->
            try {
                contentResolver.openInputStream(uri)?.readBytes()
            } catch (e: Exception) {
                null
            }
        }
        
        return client.processBatch(imageDataList)
    }
    
    fun setupWebhookListener(webhookUrl: String) {
        client.configureWebhook(webhookUrl, listOf(
            "file.processed",
            "batch.completed",
            "privacy.risk.detected"
        ))
    }
}
```

## 🧪 Testing Integration

### **Integration Testing Framework**
```typescript
// Integration test suite
describe('ProofPix Integration Tests', () => {
  let integration: ProofPixIntegration;
  
  beforeEach(() => {
    integration = new ProofPixIntegration({
      apiKey: process.env.TEST_API_KEY,
      environment: 'staging'
    });
  });
  
  test('should process single file successfully', async () => {
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await integration.processFile(testFile);
    
    expect(result.status).toBe('success');
    expect(result.metadata).toBeDefined();
    expect(result.privacyAnalysis).toBeDefined();
  });
  
  test('should handle batch processing', async () => {
    const testFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    ];
    
    const result = await integration.processBatch(testFiles);
    
    expect(result.totalFiles).toBe(2);
    expect(result.results).toHaveLength(2);
  });
  
  test('should trigger webhooks correctly', async () => {
    const webhookReceiver = new WebhookTestReceiver();
    
    await integration.configureWebhook({
      url: webhookReceiver.url,
      events: ['batch.completed']
    });
    
    const testFiles = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })];
    await integration.processBatch(testFiles);
    
    const receivedWebhook = await webhookReceiver.waitForWebhook(5000);
    expect(receivedWebhook.event).toBe('batch.completed');
  });
});
```

## 📚 Integration Examples

### **E-commerce Platform Integration**
```typescript
// Shopify app integration
class ShopifyProofPixApp {
  private shopifyClient: ShopifyClient;
  private proofPixClient: ProofPixClient;
  
  constructor(shopDomain: string, accessToken: string, proofPixApiKey: string) {
    this.shopifyClient = new ShopifyClient(shopDomain, accessToken);
    this.proofPixClient = new ProofPixClient(proofPixApiKey);
  }
  
  async processProductImages(productId: string): Promise<void> {
    // Get product images from Shopify
    const product = await this.shopifyClient.getProduct(productId);
    const images = product.images;
    
    // Process images with ProofPix
    const results = await this.proofPixClient.processBatch(images);
    
    // Update product with privacy analysis
    await this.updateProductMetadata(productId, results);
  }
  
  private async updateProductMetadata(productId: string, results: ProcessingResult[]): Promise<void> {
    const metafields = results.map(result => ({
      namespace: 'proofpix',
      key: `metadata_${result.filename}`,
      value: JSON.stringify({
        privacyRisk: result.privacyRisk,
        hasGPS: result.hasGPS,
        cameraModel: result.cameraModel
      }),
      type: 'json'
    }));
    
    await this.shopifyClient.updateProductMetafields(productId, metafields);
  }
}
```

### **Content Management System Integration**
```typescript
// WordPress plugin integration
class WordPressProofPixPlugin {
  private proofPixClient: ProofPixClient;
  
  constructor(apiKey: string) {
    this.proofPixClient = new ProofPixClient(apiKey);
  }
  
  async processMediaUpload(attachmentId: string): Promise<void> {
    // Get attachment from WordPress
    const attachment = await wp.media.attachment(attachmentId);
    
    if (!this.isImageFile(attachment.filename)) {
      return;
    }
    
    // Process with ProofPix
    const result = await this.proofPixClient.processFile(attachment.file);
    
    // Store metadata as custom fields
    await this.storeMetadata(attachmentId, result);
    
    // Add privacy warning if high risk
    if (result.privacyRisk === 'high') {
      await this.addPrivacyWarning(attachmentId, result);
    }
  }
  
  private async storeMetadata(attachmentId: string, result: ProcessingResult): Promise<void> {
    await wp.media.updateMeta(attachmentId, {
      'proofpix_privacy_risk': result.privacyRisk,
      'proofpix_has_gps': result.hasGPS,
      'proofpix_camera_model': result.cameraModel,
      'proofpix_processed_date': new Date().toISOString()
    });
  }
}
```

---

*This Integration Guide is maintained by the Technical Integration Team and updated monthly. For integration support, contact our technical team or visit the developer portal.* 