const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 80;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  // API proxy
  if (req.url.startsWith('/api/')) {
    proxyToNextJS(req, res);
    return;
  }

  // Static files
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

function proxyToNextJS(req, res) {
  // Forward API requests to Next.js on port 3000
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', () => {
    // Fallback: return mock data
    handleMockAPI(req, res);
  });

  req.pipe(proxy);
}

function handleMockAPI(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/api/cron') {
    res.end(JSON.stringify({
      cronJobs: [
        { id: '1', name: '每日综合简报', schedule: '0 8 * * *', next: '明天 08:00', last: '今天 08:00', status: 'ok' },
        { id: '2', name: '推特日报', schedule: '30 9 * * *', next: '明天 09:30', last: '今天 09:30', status: 'ok' },
        { id: '3', name: '社交媒体热点', schedule: '0 12 * * *', next: '今天 12:00', last: '3天前', status: 'ok' },
      ]
    }));
  } else if (req.url === '/api/system') {
    res.end(JSON.stringify({
      proxy: { status: 'ok', responseCode: 200 },
      system: { disk: '59%', memory: '1.4Gi/3.6Gi', cpu: '0.5', uptime: 'up 12 hours' }
    }));
  } else if (req.url === '/api/trends') {
    res.end(JSON.stringify({
      repos: [
        { name: 'wifi-densepose', owner: 'ruvnet', stars: 22152, description: 'WiFi信号实时人体姿态估计', url: 'https://github.com/ruvnet/wifi-densepose', category: '🚀 新兴技术', difficulty: 'advanced' },
        { name: 'airi', owner: 'moeru-ai', stars: 21441, description: '自托管 AI 伴侣', url: 'https://github.com/moeru-ai/airi', category: '🚀 新兴技术', difficulty: 'intermediate' },
        { name: 'taste-skill', owner: 'Leonxlnx', stars: 1857, description: '让 AI 拥有好品味', url: 'https://github.com/Leonxlnx/taste-skill', category: '🤖 AI Agent', difficulty: 'advanced' },
      ]
    }));
  } else {
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
