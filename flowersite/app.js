const http = require('http');
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((request, response) => {
    console.log(`catch - ${request.method} - ${request.url}`);
    if (request.method === 'POST') {
        if (request.url === '/api/newCallback'){
            let body = [];
            request.on('data', (chunk) => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString();
                let requestObject = JSON.parse(body);

                fs.appendFile('orders.txt',`Новый букет: ${requestObject.payload}\r\n`, 'utf8', 
                    () => {});

                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/plain;charset=utf-8');
                response.end('Заказ принят');
            })
            return;
        }
        else {
            response.statusCode = 404;
            response.end();
            return;
        }
    }
    else if (request.method === 'GET') {
        let content;
        fs.readFile('sbor.html', {encoding: 'utf8'}, (err, data) => {
            content = data;
            response.end(data);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf8');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server listen ${hostname}:${port}`);
});