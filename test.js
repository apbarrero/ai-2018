#!/usr/bin/env node

const assert = require('assert');
const _ = require('lodash');
const fs = require('fs');
const ai = require('./ai.js');

const USERS = [
  {
    "id": "foo",
    "name": "Foo",
    "phone": "+12345",
    "banned": ["bar"]
  },
  {
    "id": "bar",
    "name": "Bar",
    "phone": "+12346",
    "banned": ["foo"]
  },
  {
    "id": "baz",
    "name": "Baz",
    "phone": "+12347",
    "banned": ["qux"]
  },
  {
    "id": "qux",
    "name": "Qux",
    "phone": "+12348",
    "banned": ["baz"]
  }
];

describe('ai', () => {
   describe('getUsers', () => {
      before(() => {
          return new Promise(resolve => {
              fs.writeFile('./users.json', JSON.stringify(USERS), resolve);
          });
      });
      after(() => new Promise(resolve => fs.rm('./users.json', resolve)));
      it('loads data from file', done => {
         ai.getUsers((err, res) => {
            assert.equal(null, err);
            assert.equal(4, res.length);
            done();
         });
      });
   });
   describe('randomFriend', () => {
      describe('no ban', () => {
         const testUsers = [
            {id: 'foo', name: 'Foo', phone: '+12345'},
            {id: 'bar', name: 'Bar', phone: '+12346'},
            {id: 'baz', name: 'Baz', phone: '+12347'},
            {id: 'qux', name: 'Qux', phone: '+12348'},
         ];
         it('returns one key for each user', () => {
            let results = ai.randomFriend(testUsers);
            _.map(testUsers, 'id').forEach(u => {
               assert(Object.keys(results).includes(u));
            });
         });
         it('returns one value for each user', () => {
            let results = ai.randomFriend(testUsers);
            _.map(testUsers, 'id').forEach(u => {
               assert(Object.values(results).includes(u));
            });
         });
         it('returns value not equal to key', () => {
            let results = ai.randomFriend(testUsers);
            _.each(results, (v, k) => assert.notEqual(v, k));
         });
      });
      describe('ban', () => {
         const testUsers = [
            {id: 'foo', name: 'Foo', phone: '+12345', banned: ['bar']},
            {id: 'bar', name: 'Bar', phone: '+12346', banned: ['foo']},
            {id: 'baz', name: 'Baz', phone: '+12347', banned: ['qux']},
            {id: 'qux', name: 'Qux', phone: '+12348', banned: ['baz']},
         ];
         it('returns value not banned', () => {
            let results = ai.randomFriend(testUsers);
            _.each(results, (v, k) => {
               let banned = _.find(testUsers, u => u.id == k).banned;
               assert(!banned.includes(v));
            });
         });
      });
   });
});
