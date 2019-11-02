const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const Datauri = require('datauri');

const http = require('http');
const request = require('request');
const fs = require('fs');
const path = require('path');

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

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});
const datauri = new Datauri();

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'yashshekar',
    api_key: '767546722944791',
    api_secret: 'ClFxvVf5n3qiibjUqNRdJF-o8Ik'
});

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
    app.set('trust proxy', 1);
}

app.use(session({
    secret: 'vandyhacksvi2019'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function getUserInfo(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        userId: payload['sub'],
        givenName: payload['given_name'],
        familyName: payload['family_name']
    };
}

// Check if logged in / log out
app.get('/googleAuth', (req, res) => {
    if ('logout' in req.query && req.query.logout == 'true') {
        // logging out
        req.session.destroy()
        res.status(200).send({success: true});
    } else {
        // checking if logged in
        if ('userInfo' in req.session) {
            res.send({
                loginInfo: {
                    loggedIn: true,
                    userInfo: req.session.userInfo
                }
            });
        } else {
            res.send({
                loginInfo: {
                    loggedIn: false
                }
            })
        }
    }
})

// Log in
app.post('/googleAuth', async (req, res) => {
    try {
        const userInfo = await getUserInfo(req.body.tokenId);
        req.session.userInfo = userInfo;
        res.send({
            loginInfo: {
                loggedIn: true,
                userInfo: userInfo
            }
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).send({error: err.stack});
    }
});

// Upload photos
app.post('/upload', upload.any(), (req, res) => {
    if ('userInfo' in req.session) {
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const extname = path.extname(file.originalname).toString();
            datauri.format(extname, file.buffer);
            cloudinary.uploader.upload(datauri.content, (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    const url = res.secure_url;
                    console.log(url);
                }
            });
        }
        res.sendStatus(200);
    } else {
        res.status(400).send({error: 'Not logged in.'});
    }
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});