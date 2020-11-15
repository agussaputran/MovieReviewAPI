const express = require('express')
const app = express.Router()
const db = require('../../controller/authOrCanUseGlobal/dbController')
const { salt } = require('../../helper/bcryptHelper')
const routeErrorHandler = require('../../middleware/errorMiddleware')

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
  const hashedPassword = await salt(password)
    .catch(err => {
      next(err)
    })
  const userAdmin = {
    username,
    email,
    password: hashedPassword
  }
  const addUserAdminResult = await db.add('userAdmins', userAdmin)
    .catch(err => {
      next(err)
    })
  if (addUserAdminResult) {
    res.send(addUserAdminResult)
  } else {
    res.status(400).send('Wrong body')
  }
})


app.use(routeErrorHandler)

module.exports = app