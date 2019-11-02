const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const http = require('http');
const request = require('request');
const fs = require('fs');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const { OAuth2Client } = require('google-auth-library');

const DEV_MODE = (process.argv.length > 2);
const PORT = 3000;
const CLIENT_ID = "883452357556-rsf99lsl7dl28f092b86q5j5aqk989bf.apps.googleusercontent.com";

const app = express();
const server = http.createServer(app);
const client = new OAuth2Client(CLIENT_ID);

if (DEV_MODE) {
    const config = require('./webpack.dev.js');
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/dist/index.html');
    })
    app.use(express.static(__dirname + '/dist'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    return userId;
}

app.post('/googleAuth', async (req, res) => {
    try {
        console.log(req.body);
        const userId = await verify(req.body.tokenId);
        res.send({userId: userId});
    } catch (err) {
        console.error(err.stack);
        res.status(500).send({error: err.stack});
    }
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});