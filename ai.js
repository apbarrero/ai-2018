#!/usr/bin/env node

const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const dbName = process.env.DBNAME;
const dbUri = process.env.MONGO_URL + '/' + dbName;
const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);
const express = require('express');
const path = require('path');

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
   const banned = r => _.some(result, (v, k) => {
      let b = _.find(users, u => u.id == k).banned||[];
      b.push(k);
      return b.includes(v);
   });
   while (banned(result)) {
      mapping = _.shuffle(_users);
      result = _.zipObject(_users, mapping);
   }
   return result;
};

const sendMessage = (friend, target) => {
   let msg =
      `Hola ${friend.name}, te ha tocado ser el amigo invisible de ${target}`;
   return twilioClient.messages.create({
      to: friend.phone,
      from: '+34986080561',
      body: msg
   });
}

const main = done => {
   getUsers((err, users) => {
      if (err) done(err);
      let pairs = randomFriend(users);
      _.forEach(pairs, (v, k) => {
         let friend = _.find(users, u => u.id == k);
         let target = _.find(users, u => u.id == v);
         //sendMessage(friend, target.name);
      });
      done(null, pairs);
   });
}

const run = () => {
   const app = express();
   app.get('/', (req, res) => {
      main((err, pairs) => {
         if (err) res.status(500).send(err);
         else {
            _.forEach(pairs, (v, k) => {
               console.log(`A ${k} le ha tocado regalar a ${v}`)
            });
            res.sendFile(path.join(__dirname, 'ok.html'));
         }
      });
   });
   app.listen(3000, () => console.log('AI-2018 running'));
};

if (require.main == module)
   run();

module.exports = {getUsers, randomFriend, sendMessage};
