#!/usr/bin/env node

const _ = require('lodash');
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
   let _users = users.map(u => u.id);
   let mapping = _.shuffle(_users);
   let result = _.zipObject(_users, mapping);
   const same = r => _.some(result, (v, k) => v == k);
   while (same(result)) {
      mapping = _.shuffle(_users);
      result = _.zipObject(_users, mapping);
   }
   return result;
};

module.exports = {getUsers, randomFriend};
