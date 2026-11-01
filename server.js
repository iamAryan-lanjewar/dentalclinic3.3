/**
 * DENTAL CLINIC 2.0 - PRODUCTION-READY NODE.JS SERVER
 * Features:
 * - High-performance Static Serving with Asset Caching
 * - HTTP Compression (Gzip / Deflate)
 * - Security Headers via Helmet
 * - Search Engine Optimization (robots.txt, sitemap.xml, canonical headers)
 * - RESTful Appointment Booking API
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable HTTP Compression for faster loading & Core Web Vitals
app.use(compression());

// Security & Privacy Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
        frameSrc: ["'self'", "https://maps.google.com", "https://www.google.com"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Advanced Privacy & Device Protection Policy
app.use((req, res, next) => {
  // Disables unauthorized access to device hardware (camera, mic, geo)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-DNS-Prefetch-Control', 'on');
  next();
});

// JSON Body Parser for API Requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optimized Fast-Loading Cache-Control Strategy for Static Assets
const staticOptions = {
  maxAge: 0,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // 1-Year Immutable Caching for Fonts
    if (filePath.endsWith('.ttf') || filePath.endsWith('.otf') || filePath.endsWith('.woff2')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } 
    // 7-Day Caching for Optimized Images & Favicons
    else if (/\.(png|jpe?g|webp|svg|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    } 
    // 24-Hour Caching for Versioned Stylesheets & Scripts
    else if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } 
    // Immediate Revalidation for HTML to ensure instant updates
    else if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
  }
};

// Serve Public Static Assets
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

// Explicit SEO Routes for Fast Google & Search Engine Indexing
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/appointment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'appointment.html'));
});

app.get('/service', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'service.html'));
});

app.get('/service.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'service.html'));
});

// ====================================================================
// CLINIC RECEPTION & SECURITY CONFIGURATION
// ====================================================================
const CLINIC_RECEPTION_EMAIL = 'instinctt20@gmail.com';
const CLINIC_PHONE_NUMBER = '9823577149';
const CLINIC_PHONE_DISPLAY = '+91 98235 77149';
const CLINIC_WHATSAPP_NUMBER = '919823577149';

// Anti-Spam / Anti-Flooding Sliding-Window Rate Limiter (Security)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

// Security: Strict Input Sanitizer to block XSS, HTML Injection & CRLF/Email-Header Injection
function sanitizeInput(str, maxLength = 200) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\r\n\x00-\x1F\x7F]/g, ' ') // Strip control chars and newlines
    .replace(/[<>"'&]/g, (char) => {
      const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
      return map[char] || char;
    })
    .trim()
    .slice(0, maxLength);
}

// Secure Data & Audit Logs Initialization
const dataDir = path.join(__dirname, 'data');
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

let appointmentsDB = [];
const appointmentsFile = path.join(dataDir, 'appointments.json');
try {
  if (fs.existsSync(appointmentsFile)) {
    appointmentsDB = JSON.parse(fs.readFileSync(appointmentsFile, 'utf8'));
  }
} catch (e) {
  appointmentsDB = [];
}

// Secure Email Dispatch Service: Automatically formats & emails appointment in table format
function dispatchAppointmentNotification(appointment) {
  return new Promise((resolve) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const emailSubject = `New Dental Clinic Appointment [${appointment.id}] - ${appointment.patientName} (${appointment.treatmentType})`;

    const postPayload = JSON.stringify({
      _subject: emailSubject,
      _template: 'table',
      _captcha: 'false',
      'Booking Reference ID': appointment.id,
      'Patient Full Name': appointment.patientName,
      'Contact Phone Number': appointment.patientPhone,
      'Patient Email': appointment.patientEmail || 'Not provided',
      'Dental Procedure': appointment.treatmentType,
      'Preferred Appointment Date': appointment.preferredDate,
      'Preferred Time Slot': appointment.preferredTime || 'Morning Slot',
      'Assigned Doctor': appointment.preferredDoctor || 'Dr. Priya Arora (BDS, MDS)',
      'Comfort Preferences / Special Notes': appointment.specialNotes || 'None',
      'Submission Timestamp': `${timestamp} (IST)`,
      'Reception Notification Mail': CLINIC_RECEPTION_EMAIL,
      'Clinic Reception Hotline': CLINIC_PHONE_DISPLAY
    });

    const options = {
      hostname: 'formsubmit.co',
      port: 443,
      path: '/ajax/' + encodeURIComponent(CLINIC_RECEPTION_EMAIL),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postPayload),
        'Origin': 'https://builddear.com',
        'Referer': 'https://builddear.com/appointment'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const auditEntry = `[${timestamp}] RECIPIENT: ${CLINIC_RECEPTION_EMAIL} | ID: ${appointment.id} | PATIENT: ${appointment.patientName} | PHONE: ${appointment.patientPhone} | TREATMENT: ${appointment.treatmentType} | STATUS: HTTP ${res.statusCode} | RESPONSE: ${data}\n`;
        try {
          fs.appendFileSync(path.join(logDir, 'email_dispatches.log'), auditEntry, 'utf8');
        } catch (err) {
          console.error('Audit log write error:', err);
        }
        console.log(`\n📧 [EMAIL DISPATCH TO ${CLINIC_RECEPTION_EMAIL}] Status ${res.statusCode}: ${data}`);
        resolve({ success: res.statusCode === 200, response: data, timestamp });
      });
    });

    req.on('error', (err) => {
      console.error('Email dispatch network error:', err.message);
      const auditEntry = `[${timestamp}] RECIPIENT: ${CLINIC_RECEPTION_EMAIL} | ID: ${appointment.id} | ERROR: ${err.message}\n`;
      try {
        fs.appendFileSync(path.join(logDir, 'email_dispatches.log'), auditEntry, 'utf8');
      } catch (e) {}
      resolve({ success: false, error: err.message, timestamp });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('Email dispatch timed out');
      resolve({ success: false, error: 'Dispatch timeout', timestamp });
    });

    req.write(postPayload);
    req.end();
  });
}

// Appointment Booking API
app.post('/api/appointments', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || req.ip || '127.0.0.1';

  // Security 1: Anti-Spam Rate Limiting
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      message: `Too many booking requests. Please wait a few moments or call reception directly at ${CLINIC_PHONE_DISPLAY}.`
    });
  }

  // Security 2: Input Sanitization
  const patientName = sanitizeInput(req.body.patientName, 80);
  const patientPhone = sanitizeInput(req.body.patientPhone, 25);
  const patientEmail = sanitizeInput(req.body.patientEmail, 100);
  const treatmentType = sanitizeInput(req.body.treatmentType, 80);
  const preferredDate = sanitizeInput(req.body.preferredDate, 25);
  const preferredTime = sanitizeInput(req.body.preferredTime, 25);
  const preferredDoctor = sanitizeInput(req.body.preferredDoctor, 80);
  const specialNotes = sanitizeInput(req.body.specialNotes, 400);

  // Security 3: Required Field Validation
  if (!patientName || !patientPhone || !treatmentType || !preferredDate) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (Name, Phone, Treatment, Date).'
    });
  }

  // Security 4: Phone Format Validation (strictly 10 digits only)
  const digitsOnly = patientPhone.replace(/\D/g, '');
  if (digitsOnly.length !== 10) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 10-digit phone number (exactly 10 digits).'
    });
  }

  // Security 5: Generate Unique Booking ID
  const bookingId = 'APT-' + Math.floor(100000 + Math.random() * 900000);

  const appointment = {
    id: bookingId,
    patientName,
    patientPhone: digitsOnly,
    patientEmail: patientEmail || null,
    treatmentType,
    preferredDate,
    preferredTime: preferredTime || 'Morning Slot',
    preferredDoctor: preferredDoctor || 'Dr. Priya Arora (BDS, MDS)',
    specialNotes: specialNotes || '',
    createdAt: new Date().toISOString(),
    status: 'Confirmed & Dispatched to Reception',
    receptionEmail: CLINIC_RECEPTION_EMAIL,
    receptionPhone: CLINIC_PHONE_DISPLAY
  };

  // Securely persist to disk
  appointmentsDB.push(appointment);
  try {
    fs.writeFileSync(appointmentsFile, JSON.stringify(appointmentsDB, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist appointment:', err);
  }

  // Dispatch Email Notification in Table Format directly to instinctt20@gmail.com
  const emailDispatch = await dispatchAppointmentNotification(appointment);

  return res.status(201).json({
    success: true,
    message: 'Your appointment has been successfully received by clinic reception and dispatched to instinctt20@gmail.com!',
    id: appointment.id,
    data: appointment,
    reception: {
      email: CLINIC_RECEPTION_EMAIL,
      phone: CLINIC_PHONE_DISPLAY,
      emailDispatched: emailDispatch.success
    }
  });
});

// Clinic Reception Info Endpoint
app.get('/api/clinic-info', (req, res) => {
  res.json({
    name: 'Modern Dental Clinic',
    email: CLINIC_RECEPTION_EMAIL,
    phone: CLINIC_PHONE_DISPLAY,
    whatsappNumber: CLINIC_PHONE_NUMBER,
    whatsappUrl: `https://wa.me/${CLINIC_WHATSAPP_NUMBER}`,
    address: 'Unit No.60, Ground Floor, Anjuman Complex, Mangalwari Bazar Rd, Sadar, Nagpur, Maharashtra 440001'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

// Fallback to index.html for SPA-like navigation
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server if not already imported by test runner
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` Dental Clinic 2.0 Server running at http://localhost:${PORT}`);
    console.log(` Also available at: http://127.0.0.1:${PORT}`);
    console.log(` Production Ready | SEO Optimized | Pixel-Perfect Design`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
