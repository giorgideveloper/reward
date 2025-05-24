const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Handle the root path
    let filePath = req.url === '/' ? './index.html' : '.' + req.url;
    
    // Get the file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // Set content type based on file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    // Read the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                // Page not found
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    });
                    res.end(content, 'utf-8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

// Get local IP address
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

server.listen(PORT, () => {
    console.log(`Server running at:`);
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Network: http://${results['Wi-Fi']?.[0] || results['Ethernet']?.[0]}:${PORT}`);
    console.log('\nTo access from mobile devices:');
    console.log('1. Make sure your mobile device is connected to the same WiFi network');
    console.log('2. Open a browser on your mobile device');
    console.log('3. Enter the Network URL shown above');
    console.log('\nDevelopment mode:');
    console.log('- Server will automatically restart when you make changes to HTML, CSS, or server.js');
    console.log('- Browser cache is disabled for development');
}); 