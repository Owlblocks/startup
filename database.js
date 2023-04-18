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
    return userCollection.findOne({username: name});
}

function getUserByToken(token) {
  return userCollection.findOne({token: token});
}

function addGIF(username, filename) {
  let gif = {username: username, filename: filename};
  let user = {username: username};
  gifCollection.insertOne(gif);
  userCollection.updateOne(user, { $addToSet: { 'gifs': filename } })
  return gif;
}

function addFriend(username, friendname) {
  userCollection.updateOne(
    {username: username},
    {$addToSet: { 'friends': friendname }});
}

function pinFriend(username, friendname) {
  userCollection.updateOne(
    {username: username},
    {$addToSet: { 'pinned': friendname }});
}

async function toggleFavorite(username, gif) {
  let filter = {username: username};
  let user = await userCollection.findOne(filter);
  if((user.favorites ?? []).includes(gif)) {
    await userCollection.updateOne(filter, { $pull: { 'favorites': gif } });
  }
  else {
    await userCollection.updateOne(filter, { $addToSet: { 'favorites': gif } });
  }
  return await userCollection.findOne(filter);
}

async function registerAccount(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    passwordHash: passwordHash,
    token: uuid.v4()
  };
  await userCollection.insertOne(user);

  return user;
}

async function searchUsers(searchString) {
  let search = new RegExp(searchString);
  // console.log(searchString);
  let results = await userCollection.find({username: search});
  return results.toArray();
}

module.exports = {getUser, addGIF, addFriend, pinFriend, searchUsers, toggleFavorite, registerAccount, getUserByToken};