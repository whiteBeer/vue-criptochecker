const http = require('http');
const fs = require('fs');
var exec = require('child_process').exec;

class CriptoChecker {

    constructor (config) {
        http.createServer((req, res) => {
            this.answer(req, res);
        }).listen(config.port, (err) => {
            if (err) {
                console.log('Criptockecker: Something bad happened', err);
            } else {
                console.log('Criptockecker: Server is listening on ' + config.port);
            }
        });

        var oldPrice = null;

        refresh();
        setInterval(() => {
            refresh();
        }, 5 * 60 * 1000);

        function refresh () {
            http.get('http://api.coindesk.com/v1/bpi/currentprice.json', (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    try {
                        data = JSON.parse(data);
                        let newPrice = data.bpi.USD.rate_float;
                        console.log(new Date() + ' CriptoChecker refresh. ' + parseInt(oldPrice) + ' ' + parseInt(newPrice));
                        if (oldPrice && ((newPrice + 20) < oldPrice)) {
                            let message = 'Price decreased more then 20$! ' + parseInt(oldPrice) + ' ' + parseInt(newPrice);
                            console.log(message);
                            let command = 'curl -s -X POST https://api.telegram.org/bot1233545207:AAGHKvCEZYKxNHcdFFvnzvwaxTPEZkDTtvs/sendMessage -d chat_id=622805987 -d text="' + message + '"';
                            exec(command, function (error, stdout, stderr) {
                                stdout && console.log('stdout: ' + stdout);
                                stderr && console.log('stderr: ' + stderr);
                                error && console.log('exec error: ' + error);
                            });
                        }
                        oldPrice = (oldPrice + newPrice) / 2;
                    } catch (e) {}
                });
            }).on('error', (err) => {
                console.log('Error: ' + err.message);
            });
        }
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

new CriptoChecker({
    port: 7789
});