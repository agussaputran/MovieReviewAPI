const express = require("express");
const app = express.Router();
const routeErrorHandler = require("../../middleware/errorMiddleware");
const UserController = require("../../controller/Users/userController");

app.post("/auth/login", async (req, res, next) => {
  try {
    const user = new UserController(req.body);
    await user.login();

    delete user.body.password;
    res.status(200).send(user.body);
  } catch (error) {
    next(error);
  }
});

app.use(routeErrorHandler);

module.exports = app;
