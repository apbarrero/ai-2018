#!/usr/bin/env node

const MongoClient = require('mongodb').MongoClient;
const dbName = process.env.DBNAME;
const dbUri = process.env.MONGO_URL + '/' + dbName;

const getUsers = done => {
   MongoClient.connect(dbUri, (err, client) => {
      if (err) done(err);
      const db = client.db(dbName);
      db.collection('users').find({}).toArray((err, result) => {
         if (err) done(err);
         done(null, result);
         client.close();
      });
   });
};

const randomFriend = users => {
   let result = {};
   users.map(u => result[u.id] = 0);
   return result;
};

module.exports = {getUsers, randomFriend};
