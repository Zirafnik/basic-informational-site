const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    let filepath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    let extname = path.extname(filepath);

    let contentType = 'text/html';

    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filepath)
    .then(content => {
        res.writeHead(200, {'Content-Type': contentType});
        res.end(content);
    })
    .catch(err => {
        //404 Not Found
        if(err.code === 'ENOENT') {
            fs.readFile(path.join(__dirname, 'public', '404.html'))
            .then(content => {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(content);
            })
            .catch(err => console.log(err));
        //Server error
        } else {
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
        }
    })
})

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));