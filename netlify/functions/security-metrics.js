// 🔒 SECURITY METRICS COLLECTION - Enterprise Security
// Collects and analyzes security events for monitoring and alerting

const crypto = require('crypto');

// Security event types and their severity levels
const EVENT_SEVERITY = {
  'File validation failed': 'high',
  'File validation successful': 'low',
  'Session validation failed': 'medium',
  'Session validation successful': 'low',
  'Plan validation failed': 'medium',
  'Plan validation successful': 'low',
  'Rate limit exceeded': 'medium',
  'Fraudulent activity detected': 'critical',
  'Malicious content detected': 'high',
  'Suspicious token detected': 'high',
  'Invalid checksum detected': 'medium',
  'Stale timestamp detected': 'medium',
  'Session integrity check failed': 'high',
  'Payment security event': 'medium'
};

// In-memory storage for demo (use database in production)
const securityEvents = [];
const securityMetrics = {
  totalEvents: 0,
  criticalEvents: 0,
  highEvents: 0,
  mediumEvents: 0,
  lowEvents: 0,
  blockedAttacks: 0,
  validationFailures: 0,
  rateLimitHits: 0,
  fraudDetections: 0,
  lastUpdated: new Date().toISOString()
};

exports.handler = async (event, context) => {
  // Security headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://proofpixapp.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';

  try {
    if (event.httpMethod === 'POST') {
      return await handleSecurityEvent(event, headers, clientIP);
    } else if (event.httpMethod === 'GET') {
      return await getSecurityMetrics(event, headers, clientIP);
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  } catch (error) {
    console.error('Security metrics error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function handleSecurityEvent(event, headers, clientIP) {
  try {
    // Parse security event
    const { event: eventType, timestamp, type, details } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!eventType || !timestamp) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Rate limiting for security events
    if (await isSecurityEventRateLimited(clientIP)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Rate limit exceeded' })
      };
    }

    // Determine event severity
    const severity = EVENT_SEVERITY[eventType] || 'medium';

    // Create security event record
    const securityEvent = {
      id: generateEventId(),
      timestamp: new Date(timestamp).toISOString(),
      event: eventType,
      severity,
      type: type || 'general',
      details: sanitizeDetails(details),
      ip: clientIP,
      userAgent: event.headers['user-agent'] || 'unknown',
      processed: new Date().toISOString()
    };

    // Store event (in production, use database)
    securityEvents.push(securityEvent);
    
    // Keep only last 1000 events in memory
    if (securityEvents.length > 1000) {
      securityEvents.shift();
    }

    // Update metrics
    updateSecurityMetrics(securityEvent);

    // Check for critical events that need immediate attention
    if (severity === 'critical') {
      await handleCriticalSecurityEvent(securityEvent);
    }

    // Log for monitoring
    console.log('🔒 Security Event Recorded:', {
      id: securityEvent.id,
      event: eventType,
      severity,
      ip: clientIP
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        eventId: securityEvent.id,
        severity 
      })
    };

  } catch (error) {
    console.error('Error handling security event:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid security event data' })
    };
  }
}

async function getSecurityMetrics(event, headers, clientIP) {
  try {
    // Simple authentication check (in production, use proper auth)
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Rate limiting for metrics requests
    if (await isMetricsRateLimited(clientIP)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Rate limit exceeded' })
      };
    }

    // Get recent events (last 100)
    const recentEvents = securityEvents
      .slice(-100)
      .map(event => ({
        id: event.id,
        timestamp: event.timestamp,
        event: event.event,
        severity: event.severity,
        type: event.type,
        ip: event.ip
      }));

    // Calculate real-time metrics
    const realTimeMetrics = calculateRealTimeMetrics();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        metrics: realTimeMetrics,
        events: recentEvents,
        lastUpdated: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error getting security metrics:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve metrics' })
    };
  }
}

function updateSecurityMetrics(securityEvent) {
  securityMetrics.totalEvents++;
  securityMetrics.lastUpdated = new Date().toISOString();

  // Update severity counters
  switch (securityEvent.severity) {
    case 'critical':
      securityMetrics.criticalEvents++;
      break;
    case 'high':
      securityMetrics.highEvents++;
      break;
    case 'medium':
      securityMetrics.mediumEvents++;
      break;
    case 'low':
      securityMetrics.lowEvents++;
      break;
  }

  // Update specific metric counters
  if (securityEvent.event.includes('validation failed')) {
    securityMetrics.validationFailures++;
  }
  
  if (securityEvent.event.includes('rate limit')) {
    securityMetrics.rateLimitHits++;
  }
  
  if (securityEvent.event.includes('fraud')) {
    securityMetrics.fraudDetections++;
  }
  
  if (securityEvent.severity === 'high' || securityEvent.severity === 'critical') {
    securityMetrics.blockedAttacks++;
  }
}

function calculateRealTimeMetrics() {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  const oneDayAgo = now - (24 * 60 * 60 * 1000);

  const recentEvents = securityEvents.filter(event => 
    new Date(event.timestamp).getTime() > oneHourAgo
  );

  const dailyEvents = securityEvents.filter(event => 
    new Date(event.timestamp).getTime() > oneDayAgo
  );

  return {
    ...securityMetrics,
    hourlyEvents: recentEvents.length,
    dailyEvents: dailyEvents.length,
    criticalEventsLastHour: recentEvents.filter(e => e.severity === 'critical').length,
    highEventsLastHour: recentEvents.filter(e => e.severity === 'high').length,
    topEventTypes: getTopEventTypes(dailyEvents),
    topSourceIPs: getTopSourceIPs(dailyEvents)
  };
}

function getTopEventTypes(events) {
  const eventCounts = {};
  events.forEach(event => {
    eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
  });

  return Object.entries(eventCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([event, count]) => ({ event, count }));
}

function getTopSourceIPs(events) {
  const ipCounts = {};
  events.forEach(event => {
    if (event.ip && event.ip !== 'unknown') {
      ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
    }
  });

  return Object.entries(ipCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([ip, count]) => ({ ip, count }));
}

async function handleCriticalSecurityEvent(securityEvent) {
  // In production, this would:
  // 1. Send alerts to security team
  // 2. Trigger automated responses
  // 3. Log to SIEM system
  // 4. Potentially block IP addresses

  console.error('🚨 CRITICAL SECURITY EVENT:', {
    id: securityEvent.id,
    event: securityEvent.event,
    ip: securityEvent.ip,
    timestamp: securityEvent.timestamp,
    details: securityEvent.details
  });

  // Example: Auto-block IP for repeated critical events
  const criticalEventsFromIP = securityEvents.filter(event => 
    event.ip === securityEvent.ip && 
    event.severity === 'critical' &&
    new Date(event.timestamp).getTime() > (Date.now() - 60 * 60 * 1000) // Last hour
  );

  if (criticalEventsFromIP.length >= 3) {
    console.error('🚨 AUTO-BLOCKING IP:', securityEvent.ip);
    // In production: Add IP to blocklist
  }
}

function sanitizeDetails(details) {
  if (!details || typeof details !== 'object') {
    return {};
  }

  // Remove potentially sensitive information
  const sanitized = { ...details };
  
  // Remove PII and sensitive data
  delete sanitized.email;
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.sessionId;
  delete sanitized.userId;
  
  // Limit string lengths
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string' && sanitized[key].length > 200) {
      sanitized[key] = sanitized[key].substring(0, 200) + '...';
    }
  });

  return sanitized;
}

function generateEventId() {
  return crypto.randomBytes(8).toString('hex');
}

// Rate limiting for security events
const securityEventRateLimit = new Map();

async function isSecurityEventRateLimited(clientIP) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxEvents = 100; // Max 100 security events per minute per IP

  const key = `security_events_${clientIP}`;
  const events = securityEventRateLimit.get(key) || [];
  
  // Remove old events
  const validEvents = events.filter(timestamp => now - timestamp < windowMs);
  
  if (validEvents.length >= maxEvents) {
    return true;
  }

  validEvents.push(now);
  securityEventRateLimit.set(key, validEvents);

  return false;
}

// Rate limiting for metrics requests
const metricsRateLimit = new Map();

async function isMetricsRateLimited(clientIP) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Max 10 metrics requests per minute per IP

  const key = `metrics_${clientIP}`;
  const requests = metricsRateLimit.get(key) || [];
  
  // Remove old requests
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return true;
  }

  validRequests.push(now);
  metricsRateLimit.set(key, validRequests);

  return false;
} 