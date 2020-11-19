const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const inserNowDate = require("../../helper/inserDateHelper");
const passport = require("../../middleware/authorizationMiddleware");
const errorMiddleware = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.patch("/reviews", async (req, res, next) => {
  let body = req.body;
  const id = req.query.id;
  body.userId = req.user.id;
  body.date = inserNowDate();

  const result = await db.edit("reviews", id, body).catch((err) => {
    next(err);
  });
  res.send(result);
});
app.use(errorMiddleware);

module.exports = app;
