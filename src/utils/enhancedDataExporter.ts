import { errorHandler } from './errorHandler';

interface ExportConfig {
  format: 'csv' | 'pdf' | 'json' | 'excel';
  fileName: string;
  dashboardId?: string;
  metricIds?: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  userId?: string;
  includeHeaders?: boolean;
  groupBy?: 'day' | 'week' | 'month';
}

class EnhancedDataExporter {
  private static instance: EnhancedDataExporter;
  
  // Private constructor for singleton
  private constructor() {}
  
  // Get singleton instance
  public static getInstance(): EnhancedDataExporter {
    if (!EnhancedDataExporter.instance) {
      EnhancedDataExporter.instance = new EnhancedDataExporter();
    }
    return EnhancedDataExporter.instance;
  }
  
  /**
   * Export data in specified format
   */
  public async exportData(config: ExportConfig): Promise<boolean> {
    try {
      // In a real app, this would fetch data from an API
      // For demo purposes, we'll generate mock data
      const data = await this.fetchAnalyticsData(config);
      
      // Export data in appropriate format
      switch (config.format) {
        case 'csv':
          return this.exportToCsv(data, config);
        case 'excel':
          return this.exportToExcel(data, config);
        case 'pdf':
          return this.exportToPdf(data, config);
        case 'json':
          return this.exportToJson(data, config);
        default:
          throw new Error(`Unsupported export format: ${config.format}`);
      }
    } catch (error) {
      errorHandler.handleError('data_export_failed', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  
  /**
   * Fetch analytics data
   */
  private async fetchAnalyticsData(config: ExportConfig): Promise<any[]> {
    // In a real app, this would call an API to get the data
    // For demo purposes, we'll generate mock data
    
    const mockData = [];
    const dayRange = Math.ceil((config.dateRange.end.getTime() - config.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate a data point for each day in the range
    for (let i = 0; i < dayRange; i++) {
      const date = new Date(config.dateRange.start);
      date.setDate(date.getDate() + i);
      
      const dataPoint: Record<string, any> = {
        date: date.toISOString().split('T')[0],
        timestamp: date.toISOString()
      };
      
      // Add data for each requested metric
      if (config.metricIds && config.metricIds.length > 0) {
        config.metricIds.forEach(metricId => {
          // Generate random values for demo
          switch (metricId) {
            case 'file_count':
              dataPoint[metricId] = Math.floor(Math.random() * 1000);
              break;
            case 'processing_time':
              dataPoint[metricId] = Math.random() * 10;
              break;
            case 'error_rate':
              dataPoint[metricId] = Math.random() * 0.05;
              break;
            case 'api_usage':
              dataPoint[metricId] = Math.floor(Math.random() * 5000);
              break;
            case 'storage_used':
              dataPoint[metricId] = Math.floor(Math.random() * 1024 * 1024 * 1024);
              break;
            case 'active_users':
              dataPoint[metricId] = Math.floor(Math.random() * 500);
              break;
            default:
              dataPoint[metricId] = Math.random() * 100;
          }
        });
      } else {
        // Default metrics if none specified
        dataPoint.views = Math.floor(Math.random() * 1000);
        dataPoint.conversions = Math.floor(Math.random() * 100);
        dataPoint.revenue = Math.random() * 10000;
      }
      
      mockData.push(dataPoint);
    }
    
    return mockData;
  }
  
  /**
   * Export data to CSV
   */
  private exportToCsv(data: any[], config: ExportConfig): boolean {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }
      
      // Get headers from first data object
      const headers = Object.keys(data[0]);
      
      // Create CSV content
      let csvContent = '';
      
      // Add headers
      if (config.includeHeaders !== false) {
        csvContent += headers.join(',') + '\n';
      }
      
      // Add data rows
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          // Handle special characters and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvContent += values.join(',') + '\n';
      });
      
      // Create download link
      this.downloadFile(csvContent, `${config.fileName}.csv`, 'text/csv');
      
      return true;
    } catch (error) {
      errorHandler.handleError('csv_export_failed', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  
  /**
   * Export data to Excel
   */
  private exportToExcel(data: any[], config: ExportConfig): boolean {
    try {
      // For a real implementation, you would use a library like xlsx
      // For demo purposes, we'll just use CSV
      return this.exportToCsv(data, config);
    } catch (error) {
      errorHandler.handleError('excel_export_failed', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  
  /**
   * Export data to PDF
   */
  private exportToPdf(data: any[], config: ExportConfig): boolean {
    try {
      // For a real implementation, you would use a library like jsPDF
      // For demo purposes, we'll create a simple HTML display and "print" it
      
      // Create a table from the data
      let tableHtml = '<table border="1" cellpadding="5" cellspacing="0">';
      
      // Add headers
      if (config.includeHeaders !== false) {
        const headers = Object.keys(data[0]);
        tableHtml += '<thead><tr>';
        headers.forEach(header => {
          tableHtml += `<th>${header}</th>`;
        });
        tableHtml += '</tr></thead>';
      }
      
      // Add data rows
      tableHtml += '<tbody>';
      data.forEach(row => {
        tableHtml += '<tr>';
        Object.values(row).forEach(value => {
          tableHtml += `<td>${value}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table>';
      
      // Create a printable window with the table
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your browser settings.');
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${config.fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { border-collapse: collapse; width: 100%; }
              th { background-color: #f2f2f2; }
              th, td { padding: 8px; text-align: left; }
              tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h1>${config.fileName}</h1>
            <p>Date Range: ${config.dateRange.start.toLocaleDateString()} - ${config.dateRange.end.toLocaleDateString()}</p>
            ${tableHtml}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      
      return true;
    } catch (error) {
      errorHandler.handleError('pdf_export_failed', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  
  /**
   * Export data to JSON
   */
  private exportToJson(data: any[], config: ExportConfig): boolean {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      
      this.downloadFile(jsonString, `${config.fileName}.json`, 'application/json');
      
      return true;
    } catch (error) {
      errorHandler.handleError('json_export_failed', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  
  /**
   * Create a download file from content
   */
  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

// Export singleton instance
export const enhancedDataExporter = EnhancedDataExporter.getInstance();
export default enhancedDataExporter; 