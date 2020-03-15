  
const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    // console.log('MADE IT')
    const { user_name, password } = req.body
    const loginUser = { user_name, password }
    // console.log('MY USER INFO: ',loginUser)

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    // SERVICE CALL
    // console.log('checking to see if username exists')
    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(dbUser => {
        // console.log('USER EXISTS: ',dbUser)
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect Business Name or Password',
          })
        // SERVICE CALL
        return AuthService.comparePasswords(loginUser.password, dbUser.business_password)
          .then(compareMatch => {
            // console.log('comparing passwords: ', dbUser.business_password)
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect Business Name or Password',
              })

            // console.log('SUCCESS. They matched')
            const sub = dbUser.business_name
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload),
              id: dbUser.id
            })
          })
      })
      .catch(next)
  })

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name
  const payload = { user_id: req.user.id }
  // SERVICE CALL
  res.send({
    authToken: AuthService.createJwt(sub, payload),
    id: req.user.id 
  })
})

module.exports = authRouter