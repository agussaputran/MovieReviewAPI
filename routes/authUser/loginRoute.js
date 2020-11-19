const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const jwt = require("jsonwebtoken");
const routeErrorHandler = require("../../middleware/errorMiddleware");
const { checkPassword } = require("../../helper/bcryptHelper");
const secret = process.env.JWT_SECRET;

<<<<<<< HEAD:routes/authUser/loginRoute.js

app.post('/authUser/login', async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
=======
app.post("/auth/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
>>>>>>> origin/feature-get-movies-by-search:routes/auth/loginRoute.js
  let user;

  const result = await db.get("users", { email }).catch((err) => next(err));

  if (result.length) {
    user = result[0];
    const isPasswordMatch = await checkPassword(
      password,
      user.password
    ).catch((err) => next(err));
    if (isPasswordMatch) {
      const token = jwt.sign(user, secret, {
        expiresIn: "6h",
      });
      user.token = token;
      res.send(user);
      return;
    } else {
      res.status(401).send("Unauthorized");
      return;
    }
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.use(routeErrorHandler);

module.exports = app;
