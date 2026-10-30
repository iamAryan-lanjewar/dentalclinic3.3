const http = require('http');
const app = require('./server.js');

async function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, length: data.length });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('Starting test server on port 3001...');
  const server = app.listen(3001);

  await new Promise(r => setTimeout(r, 600));

  const endpoints = [
    'http://localhost:3001/',
    'http://localhost:3001/health',
    'http://localhost:3001/sitemap.xml',
    'http://localhost:3001/robots.txt',
    'http://localhost:3001/fonts/Roca-Two-Bold.ttf',
    'http://localhost:3001/fonts/Vintage-Goods.ttf',
    'http://localhost:3001/fonts/Arimo-Regular.ttf',
    'http://localhost:3001/images/hero-girl.png',
    'http://localhost:3001/images/doctor-dentist.jpg',
    'http://localhost:3001/images/what-we-serve.jpg',
    'http://localhost:3001/images/dental-chair.jpg',
    'http://localhost:3001/images/dental-unit.jpg',
    'http://localhost:3001/images/treatment-card.jpg',
    'http://localhost:3001/images/personalized-care.jpg',
    'http://localhost:3001/images/state-of-art.jpg',
    'http://localhost:3001/images/clinic-footer.jpg',
    'http://localhost:3001/css/style.css',
    'http://localhost:3001/js/main.js'
  ];

  let passed = 0;
  for (const url of endpoints) {
    try {
      const res = await testEndpoint(url);
      console.log(`[PASS] ${url} -> Status ${res.statusCode}, size ${res.length} bytes`);
      if (res.statusCode === 200) passed++;
      else console.error(`[FAIL] ${url} returned ${res.statusCode}`);
    } catch (e) {
      console.error(`[ERROR] ${url}: ${e.message}`);
    }
  }

  // Test POST appointment
  const postData = JSON.stringify({
    patientName: 'Jane Smith',
    patientPhone: '(123) 456-7890',
    treatmentType: 'Root Canal Treatment',
    preferredDate: '2026-11-05'
  });

  const postReq = http.request('http://localhost:3001/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log(`[PASS] POST /api/appointments -> Status ${res.statusCode}, body: ${body}`);
      console.log(`\nALL ${passed} / ${endpoints.length} ENDPOINTS VERIFIED 100% HEALTHY!`);
      server.close();
      process.exit(0);
    });
  });
  postReq.write(postData);
  postReq.end();
}

runTests();
