// utils/logger.js - Fixed version with proper ENV import
import { ENV } from './environment';

export class Logger {
  constructor(category = 'App') {
    this.category = category;
    this.enabled = ENV.isDevelopment;
  }
  
  debug(message, data = null) {
    if (this.enabled && ENV.isDevelopment) {
      console.log(`[${this.category}] DEBUG: ${message}`, data || '');
    }
  }
  
  info(message, data = null) {
    if (this.enabled) {
      console.info(`[${this.category}] INFO: ${message}`, data || '');
    }
  }
  
  warn(message, data = null) {
    if (this.enabled) {
      console.warn(`[${this.category}] WARN: ${message}`, data || '');
    }
  }
  
  error(message, error = null, data = null) {
    console.error(`[${this.category}] ERROR: ${message}`, error || '', data || '');
  }
  
  performance(label, startTime) {
    if (this.enabled && ENV.isDevelopment) {
      const duration = performance.now() - startTime;
      console.log(`[${this.category}] PERF: ${label} took ${duration.toFixed(2)}ms`);
    }
  }
}