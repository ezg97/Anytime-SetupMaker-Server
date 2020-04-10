//  --- requirements ---
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const { PORT, DDATABASE_URL } = require('./config')
const setupRouter = require('./setup/setup-router');
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

//  --- middleware ---
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function tableHeader(req, res, next){
  //grab the table from the header
  const table = req.get('table');
    
  app.set('table', table);
  
      // move to the next middleware
  next();
});


//  --- endpoints ---
app.get('/', (req, res,next) => {
    res.send('Hello, world!')
});

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use(setupRouter);



app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: `server error` }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  

//  --- export ---
module.exports = app;
