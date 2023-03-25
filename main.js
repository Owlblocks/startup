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

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

app.use('/data', express.static('data'))

app.use(cors({
    origin: '*'
}));

var apiRouter = express.Router();
app.use('/api', apiRouter);

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

app.listen(port);
console.log(`app listening on port ${port}`);