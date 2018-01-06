# Secret Santa raffle

This is a small node.js application to perform a raffle for a secret Santa
setup. User (participant) data is read from a MongoDB database. When raffle
is done, users received their assigned target via SMS messages.

## Name

I used the initials of _"Amigo Invisible"_ which stands for _Invisible
friend_ (Spanish for Secret Santa). So nothing to do with Artificial
Intelligence.

## Requirements

### Node version

I used node 8.9.1, but there are no complex new language features so it
probably works fine with node >= 6.

### MongoDB database

It needs a **MongoDB connection string** to connect to a database with a
collection named `users` that contains data for the participants with
the following format:

```
{
    "id": "antonio",
    "name": "Antonio",
    "phone": "+346XXXXXXXX",
    "banned": [
        "partner"
    ]
}
```

### Twilio account

It also needs credentials for a **[Twilio](https://www.twilio.com/) account**
with an SMS cappable phone number.

### Environment

In order not to have the credentials for database and Twilio account hardcoded,
the program expects to read these values from environment values. So you
can provide a `.env` file in the root directory of the application. This file 
should look like this:

```
MONGO_URL=mongodb://<user>:<password>@localhost:33017
DBNAME=ai-2018
TWILIO_ACCOUNTSID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_SOURCE_NO=+34XXXXXXXXX
```

## Running

Just provide the right [environment file](#environment) and run

```
npm install
npm start
```

## Testing

```
npm install
npm test
```

One of the test cases checked that database contains a non-empty set of users.
So you will need to provide a valid value for the MongoDB connection string
and database name in the [environment file](#environment).

Tests don't require a Twilio account credentials though.

