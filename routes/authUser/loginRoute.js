const express = require("express");
const app = express.Router();
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.post("/authUser/login", async (req, res, next) => {
  try {
    const user = new UserController(req.body);
    await user.login();

    delete user.body.password;
    res.send(user.body);
  } catch (error) {
    next(error);
  }
});

app.use(routeErrorHandler);

module.exports = app;
