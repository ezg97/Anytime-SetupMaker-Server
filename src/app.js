//  --- requirements ---
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const { PORT, DB_URL } = require('./config')
const scheduleRouter = require('./schedule/schedule-router');
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

/*///////////////////////////////////
const jwt = require('jsonwebtoken');

app.use(express.json())
///////////////////////////////////*/

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

app.use(scheduleRouter);
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)



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

/*app.get('/st', (req,res,next) => {
    ScheduleService.getInfo(req.app.get('db'))
      .then(info => {
        if (!info) {
          logger.error(`No info found.`)
          return res.status(404).json({
            error: { message: `Info Not Found` }
          })
        }
        res.json(info)
      })
      .catch(next)
})*/




/*test info

const posts = [
  {
    username: 'ezg97',
    title: 'Post 1'
  },
  {
    username: 'Jim2',
    title: 'Post2'
  }
]

// test post endpoint
app.get('/posts', authenticateToken, (req,res) => {
  res.json(posts.filter(post => post.username === req.user.name))


})


// -- middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1]
 // Bearer TOKEN

  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)

    req.user = user
    next();
 })



}
*/