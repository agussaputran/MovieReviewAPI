const express = require('express')
const app = express.Router()
const db = require('../../controller/authOrCanUseGlobal/dbController')
const { salt } = require('../../helper/bcryptHelper')
const routeErrorHandler = require('../../middleware/errorMiddleware')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

app.post('/authAdmins/register', async (req, res, next) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  const isUsernameExist = await db.get('userAdmins', { username })
    .catch(err => {
      next(err)
    })
  if (isUsernameExist && isUsernameExist.length) {
    return res.status(409).send('The same username has exist')
  }
  const isEmailExist = await db.get('userAdmins', { email })
    .catch(err => {
      next(err)
    })
  if (isEmailExist && isEmailExist.length) {
    return res.status(409).send('Email already used')
  }
  const hashedPassword = await salt(password)
    .catch(err => {
      next(err)
    })
  const userAdmin = {
    username,
    email,
    password: hashedPassword
  }
  const addUserResult = await db.add('userAdmins', userAdmin)
    .catch(err => {
      next(err)
    })
  if (addUserResult) {
    const token = jwt.sign(addUserResult, secret, {
      expiresIn: '6h'
    })
    addUserResult.token = token
    res.send(addUserResult)
  } else {
    res.status(400).send('Wrong body')
  }
})


app.use(routeErrorHandler)

module.exports = app
