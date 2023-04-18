const express = require('express');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './data/gifs/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '.gif')
    }
});
const gifUpload = multer({storage: storage});
const cors = require('cors');
//const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'auth';

app.use(express.json());

app.use(express.static('public'));
app.use('/data', express.static('data'));

app.use(cookieParser());

app.use(cors({
    origin: '*'
}));

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/register', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(await DB.getUser(username)) {
        res.status(409).send({msg: 'this username is unavailable'});
    }
    else {
        const user = await DB.registerAccount(username, password);

        setAuthCookie(res, user.token);

        res.send({ id: user._id });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const user = await DB.getUser(username);
    if(user) {
        if(await bcrypt.compare(password, user.passwordHash)) {
            setAuthCookie(res, user.token);
            res.send({id: user._id});
            return;
        }
    }
    res.status(401).send({msg: 'Login Failed'});
});

apiRouter.post('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

apiRouter.get('/auth/ping', async (req, res) => {
    // console.log('ping');
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if(user) {
        res.send({username: user.username});
    }
    else {
        res.send({username: ''});
    }
})

apiRouter.post('/upload/gif', gifUpload.single('gif'), function(req, res, next) {
//    console.log('upload');
    let filename = req.file.filename;
    let username = req.body.username;
//    console.log(`${filename}, ${username}`);
    const gif = DB.addGIF(username, filename);
    res.send(gif);
    next();
});

apiRouter.get('/gif/:id', async (_req, res) => {
    let id = _req.params.id;
    res.sendFile(`data/gifs/${id}`, {root: __dirname});
});

apiRouter.post('/user/:username/addfriend/:friendname', async (req, res) => {
    let username = req.params.username;
    let friendname = req.params.friendname;
    // console.log(friendname);
    DB.addFriend(username, friendname);
    DB.getUser(username).then((res2) => {
        // console.log(res2);
        // console.log(username);
        res.send(res2.friends);
    });
});

apiRouter.post('/user/:username/pin/:friendname', async (req, res) => {
    let username = req.params.username;
    let friendname = req.params.friendname;
    DB.pinFriend(username, friendname);
    res.send('pinned');
});

apiRouter.post('/user/:username/togglefavorite/:gif', async (req, res) => {
    let username = req.params.username;
    let gif = req.params.gif;
    let ret = await DB.toggleFavorite(username, gif);
    res.status(200).send(ret);
})

function scrubUser(user) {
    let {_id, passwordHash, token, ...scrubbed} = user;
    return scrubbed;
}

apiRouter.post('/user/search', async (req, res) => {
    let searchResults = (await DB.searchUsers(req.body.searchString)).map(scrubUser);
    // console.log(searchResults);
    res.send(searchResults);
})

const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    // console.log('sec');
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if(user) {
        // console.log(user);
        next();
    }
    else {
        res.status(401).send({msg: 'Unauthorized'});
    }
});

secureApiRouter.get('/user/:username', async (_req, res) => {
    let name = _req.params.username;
    let user = await DB.getUser(name);
    res.send(scrubUser(user));
});
/*
app.use(async (req, res) => {
    let authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if(user) {
        res.sendFile('index.html', {root: 'public'});
    }
    else {
        res.sendFile('login.html', {root: 'public'})
    }
});
*/

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    });
}

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});