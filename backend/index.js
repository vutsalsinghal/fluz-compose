require('dotenv').config()
const bodyParser = require("body-parser")
const cors = require("cors")
const express = require("express");
const session = require("express-session")
const knex = require("./db/knex")
const graphqlHTTP = require('express-graphql');
const schema = require("./schema")
const jwt = require('jsonwebtoken');

const app = express()
app.use(cors('*'), bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  //name: process.env.SESSION_NAME,
  secret: 'process.env.SESSION_SECRET',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12, // 1 year
    secure: process.env.NODE_ENV === 'production'
  }
}))

const getMe = async (req) => {
  const token = req.headers['x-token'];
  //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsImlhdCI6MTU1ODI5MzM5OSwiZXhwIjoxNTU4Mjk5Mzk5fQ.gXHeXLSVwLDy3avjH3lZzkW7jA-GaViZa78gIjqDqmU'
  console.log('in getMe: ', token);

  if (token) {
    try {
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      console.log('in getMe token exists: ', payload);
      return payload;
    } catch (e) {
      //throw new Error('Your token expired. Sign in again.');
      //localStorage.setItem('token', '');
    }
  }
};

let me;
app.use('/graphql', async (req, res, next) => {
  me = await getMe(req);
  console.log('in middleware: ', me);
  next()
})

app.use('/graphql', graphqlHTTP(async (req) => ({
  schema,
  graphiql: true,
  context: {
    me: me,
    request: req,
    jwt_secret: process.env.JWT_SECRET
  }
})));

app.get("/", async (req, res) => {
  const userTableExists = await knex.schema.hasTable('user');

  // If tables are missing then run migration and seed the tables!
  if (!userTableExists) {
    await knex.migrate.latest();
    await knex.seed.run();
  }
  const data = await knex.select().table("user")
  console.log("userExists: ", userTableExists);
  res.send(data);
});

app.listen(process.env.PORT);