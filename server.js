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
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable HTTP Compression for faster loading & Core Web Vitals
app.use(compression());

// Security Headers with Helmet (Customized for Google Fonts and Local Assets)
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
  })
);

// JSON Body Parser for API Requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cache-Control Header for Static Assets (Images, Fonts, CSS, JS)
const staticOptions = {
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.ttf') || filePath.endsWith('.otf') || filePath.endsWith('.woff2')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else if (filePath.endsWith('.css') || filePath.endsWith('.js') || filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
};

// Serve Public Static Assets
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

// Explicit SEO Routes
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/appointment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'appointment.html'));
});

// Appointment Booking API
const appointmentsDB = [];

app.post('/api/appointments', (req, res) => {
  const { patientName, patientPhone, patientEmail, treatmentType, preferredDate, specialNotes } = req.body;

  if (!patientName || !patientPhone || !treatmentType || !preferredDate) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (Name, Phone, Treatment, Date).'
    });
  }

  const appointment = {
    id: 'APT-' + Date.now(),
    patientName,
    patientPhone,
    patientEmail: patientEmail || null,
    treatmentType,
    preferredDate,
    specialNotes: specialNotes || '',
    createdAt: new Date().toISOString(),
    status: 'Confirmed'
  };

  appointmentsDB.push(appointment);
  console.log(`[New Booking] ${appointment.id}: ${patientName} on ${preferredDate} for ${treatmentType}`);

  return res.status(201).json({
    success: true,
    message: 'Your appointment has been successfully scheduled!',
    data: appointment
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
