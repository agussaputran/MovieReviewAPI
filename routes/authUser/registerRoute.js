const express = require("express");
const UserController = require("../../controller/Users/userController");
const routeErrorHandler = require("../../middleware/errorMiddleware");
const app = express.Router();

app.post("/auth/register", async (req, res, next) => {
  try {
    const user = new UserController(req.body);
    await user.register();

    delete user.body.password;
    res.status(200).send(user.body);
  } catch (error) {
    next(error);
  }
});

app.use(routeErrorHandler);

module.exports = app;
