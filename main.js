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
            SetAuthCookie(res, user.token);
            res.send({id: user._id});
            return;
        }
    }
    res.status(401).send('Unauthorized');
});

apiRouter.post('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

apiRouter.get('/user/:username', async (_req, res) => {
    let name = _req.params.username;
    let str = await DB.getUser(name);
    res.send(str);
});

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
    let file = new File({fileName: `data/gifs/${id}`});
    res.send();
});

const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if(user) {
        next();
    }
    else {
        res.status(401).send({msg: 'Unauthorized'});
    }
});

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