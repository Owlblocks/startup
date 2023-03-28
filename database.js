const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('baobab').collection('users');
const gifCollection = client.db('baobab').collection('gifs');

function getUser(name) {
    return userCollection.findOne({userName: name});
}

function getUserByToken(token) {
  return userCollection.findOne({token: token});
}

function addGIF(username, filename) {
  let gif = {username: username, filename: filename};
  gifCollection.insertOne(gif);
  return gif;
}

async function registerAccount(username, password) {
  const passwordHash = bcrypt(password, 10);

  const user = {
    username: username,
    passwordHash: passwordHash,
    token: uuid.v4()
  };
  await userCollection.insertOne(user);

  return user;
}

module.exports = {getUser, addGIF, registerAccount, getUserByToken};