#!/usr/bin/env node

const _ = require('lodash');
const { Telegraf } = require('telegraf');
const fs = require('fs');

const RESULT_FILE = './result.json';

const getUsers = done => {
   fs.readFile('./users.json', 'utf-8', (err, res) => {
       if (err) {
           done(err);
       } else {
           done(err, JSON.parse(res));
       }
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

const raffle = async () => {
   if (fs.existsSync(RESULT_FILE)) {
      const result = fs.readFileSync(RESULT_FILE);
      return JSON.parse(result);
   }
   let users = await new Promise((resolve, reject) => {
       getUsers((reject, users) => {
           resolve(users);
       });
   });
   const pairs = randomFriend(users);
   users.forEach((user, i) => {
       users[i].target = pairs[user.id];
   });
   fs.writeFileSync(RESULT_FILE, JSON.stringify(users));
   return users;
}

const run = async () => {
    const promptMessage = `
Soy el bot del amigo invisible de los Reyes 2021 para la familia Barrero.

Confírmame tu número de teléfono para saber quién es tu amigo invisible este año
`;
    const bot = new Telegraf(process.env.BOT_TOKEN)

    const results = await raffle();
    console.log(results);

    bot.command('quit', (ctx) => {
        // Explicit usage
        ctx.telegram.leaveChat(ctx.message.chat.id)

        // Using context shortcut
        ctx.leaveChat()
    });

    bot.start(ctx => {
        ctx.reply(`Hola, ${ctx.update.message.from.first_name}. ${promptMessage}`);
    });
    bot.on('text', (ctx) => {
        const phone = ctx.update.message.text;
        const user = results.find(user => user.phone === phone);
        if (!user) {
            ctx.reply('¿Seguro que ése es tu número? Vuelve a dármelo, por favor');
        } else {
            ctx.reply(`Has dicho que eres ${user.name}. Tu amigo invisible es ${user.target}`);
        }
    });

    bot.launch();
};

if (require.main == module)
   run();

module.exports = {getUsers, randomFriend};
