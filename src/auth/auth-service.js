const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  getUserWithUserName(db, business_name) {
    return db
      .from('business')
      .where({ business_name })
      .first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    })
  },
  verifyJwt(token) {

    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    })
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':')
  },
}

module.exports = AuthService


/*
this is autho branch
//  --- requirements ---
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const { PORT, DB_URL } = require('./config')
const scheduleRouter = require('./schedule/schedule-router');

///////////////////added/////////////////
const jwt = require('jsonwebtoken');

app.use(express.json())
///////////////////added/////////////////

/// NOrmally don't store locally, database
let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token

    if(refreshToken == null) return res.sendStatus(401)

    if(refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)

        const accessToken = generateAccessToken({name: user.name})

        res.json({ accessToken: accessToken })
    })

})


app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    
    res.status.send(204)
})



// -- JWT

app.post('/login', (req, res) => {
    //Authenticate User

  const username = req.body.username;
  const user ={ name: username }

  const accessToken = enerateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

  //now we have a record of that refresh token
  refreshTokens.push(refreshToken);

  res.json({ accessToken: accessToken, refreshToken: refreshToken})
})


// -- function
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s' })
}



app.listen(4000)

*/