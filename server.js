const next = require('next');
const express = require('express');
const compression = require('express-compression');
const { join } = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });

const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        return false
    }
    return compression.filter(req, res)
}

app.prepare().then(() => {
    const expressApp = express();
    const handle = app.getRequestHandler();

    expressApp.use(compression({ filter: shouldCompress }));
    expressApp.use(
        '/uploads/user-profile-pictures',
        express.static(join(process.cwd(), 'public/uploads/user-profile-pictures'))
    );

    expressApp.use(
        '/uploads/deposit-pictures',
        express.static(join(process.cwd(), 'public/uploads/deposit-pictures'))
    );

    expressApp.all('*', (req, res) => {
        return handle(req, res);
    });

    expressApp.listen(port, () => {
        console.log(`🚀 ~ Custom Server listen On ~> http://localhost:${port}`)
    })
}).catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
});
