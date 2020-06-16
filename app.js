const http = require('http');
const fs = require('fs');

class AdminApp {

    constructor (config) {
        http.createServer((req, res) => {
            this.answer(req, res);
        }).listen(config.port, (err) => {
            if (err) {
                console.log('Admin App: Something bad happened', err);
            } else {
                console.log('Admin App: Server is listening on ' + config.port);
            }
        });
    }

    answer (req, res) {
        if (req.url === '/') {
            let indexHtml = fs.readFileSync('./index.html', 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexHtml);
        } else if (fs.existsSync('.' + req.url)) {
            const contentType = (() => {
                if (req.url.endsWith('.css')) {
                    return 'text/css';
                } else if (req.url.endsWith('.js')) {
                    return 'text/javascript';
                }
                return '';
            })();
            if (contentType) {
                res.writeHead(200, { 'Content-Type': contentType });
            }
            res.end(fs.readFileSync('.' + req.url));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Admin App: 404 Resource is not found.');
        }
    }
}

new AdminApp({
    port: 8888
});