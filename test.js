#!/usr/bin/env node

const assert = require('assert');
const _ = require('lodash');
const ai = require('./ai.js');


describe('ai', () => {
   describe('getUsers', () => {
      it('has non-zero size', done => {
         ai.getUsers((err, res) => {
            assert.equal(null, err);
            assert(res.length);
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
            _.pluck(testUsers, 'id').forEach(u => {
               Object.keys(results).includes(u);
            });
         });
      });
   });
});
