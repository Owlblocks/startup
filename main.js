const express = require('express');
const app = express();
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/user/:username', async (_req, res) => {
    let name = _req.params.username;
    let str = await DB.getUser(name);
    res.send(str);
});

app.listen(port);