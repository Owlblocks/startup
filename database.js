const {MongoClient} = require('mongodb');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('baobab').collection('users');

function getUser(name) {
    const query = {username: name};
    options = {
        limit: 10,
    };
    const res = userCollection.find(query, options);
    return res.toArray();
}

module.exports = {getUser};