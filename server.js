/**
 * Libraries
 */
const http = require('http');
const request = require('request');
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const Datauri = require('datauri');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');

/**
 * Constants
 */
const DEV_MODE = (process.argv.length > 2);
const PORT = 3000;
const CLIENT_ID = "883452357556-rsf99lsl7dl28f092b86q5j5aqk989bf.apps.googleusercontent.com";

/**
 * Library Setup
 */
const app = express();
const server = http.createServer(app);
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});
const datauri = new Datauri();

/**
 * API's
 */
const client = new OAuth2Client(CLIENT_ID);
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'yashshekar',
    api_key: '767546722944791',
    api_secret: 'ClFxvVf5n3qiibjUqNRdJF-o8Ik'
});

/**
 * Mongoose
 */
const connectionString = 'mongodb+srv://tvadakumchery:hAkbTv2i3sKwEoDD@socialsavage-lsx4y.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    //useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (err) => console.error(err.stack));

const userSchema = new mongoose.Schema({
    googleUserId: String
});

const User = mongoose.model('User', userSchema);

async function createUser(googleUserId) {
    return new User({
        googleUserId: googleUserId
    }).save();
}

async function findUser(googleUserId) {
    return await User.findOne({googleUserId: googleUserId});
}

const postSchema = new mongoose.Schema({
    author: mongoose.Schema.Types.ObjectId,
    images: [String],
    captions: [String],
    ratings: [{
        rater: mongoose.Schema.Types.ObjectId,
        topPic: Number,
        topCaption: Number
    }]
});

postSchema.methods.hasBeenSeenBy = (user) => {
    for (let i = 0; i < this.ratings.length; i++) {
        const rating = this.ratings[i];
        if (rating.rater == user._id) {
            return true;
        }
    }
    return false;
};

const Post = mongoose.model('Post', postSchema);

async function makePost(_id, files, captions) {
    let images = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadToCloudinary(file);
        images.push(url);
    }
    return new Post({
        author: _id,
        images: images,
        captions: captions,
        ratings: []
    }).save();
}

async function getUserPosts(_id) {
    return await Post.find({author: _id});
}

/**
 * Set up production / development environments
 */
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

/**
 * Common middleware
 */
app.use(session({
    secret: 'vandyhacksvi2019',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * API Functions
 */
async function getUserInfo(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    
    let user = await findUser(userId);

    if (!user) {
        user = await createUser(userId);
    }

    return {
        _id: user._id,
        userId: userId,
        givenName: payload['given_name'],
        familyName: payload['family_name']
    };
}

async function uploadToCloudinary(file) {
    const extname = path.extname(file.originalname).toString();
    datauri.format(extname, file.buffer);
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(datauri.content, (err, res) => {
            if (err) {
                reject(err);
            } else {
                const url = res.secure_url;
                resolve(url);
            }
        });
    });
}

/**
 * HTTP Endpoints
 */
app.get('/isLoggedIn', (req, res) => {
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
});

app.post('/login', async (req, res) => {
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

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.status(200).send({success: true});
})

app.post('/upload', upload.any(), async (req, res) => {
    try {
        if ('userInfo' in req.session && req.files.length > 0) {
            await makePost(req.session.userInfo._id, req.files, JSON.parse(req.body.captions));
            res.sendStatus(200);
        } else {
            res.status(400).send({error: 'Not logged in.'});
        }
    } catch (err) {
        console.error(err.stack);
        res.status(500).send({error: err.stack});
    }
});

app.get('/rate', async (req, res) => {
    // for (let i = 0; i < 30; i++) {
    //     await new Post({
    //         author: mongoose.Types.ObjectId(),
    //         images: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
    //         captions: ['test caption'],
    //         ratings: [{
    //             rater: mongoose.Types.ObjectId(),
    //             topPic: 0,
    //             topCaption: 0
    //         }]
    //     }).save();
    // }
    if ('userInfo' in req.session) {
        const { offset, limit } = req.query;
        const posts = await Post.find({}).skip(parseInt(offset)).limit(parseInt(limit));
        res.send(posts);
    } else {
        res.status(400).send({error: 'Not logged in.'});
    }
})

app.get('/feedback', async (req, res) => {
    if ('userInfo' in req.session) {
        const posts = await getUserPosts(req.session.userInfo._id);
        res.send(posts);
    } else {
        res.status(400).send({error: 'Not logged in.'});
    }
});

/**
 * Run Server
 */
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});