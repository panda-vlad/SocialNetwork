const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./router/api/users');
const profile = require('./router/api/profile');
const posts = require('./router/api/posts');

const app = express();

//Body parser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require('./mongoose/config').mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));

//  passport
app.use(passport.initialize());

require('./config/passport')(passport);

//USE Routers
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const server = app.listen(3001, (error) => {
  if (error) return console.log(err);
  console.log('OK server run on port 3001');
});
