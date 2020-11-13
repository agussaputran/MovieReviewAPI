const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.get("/movies", async (req, res, next) => {
  const query = req.query;
  const id = req.user.id;
  query.userId = id;
  const result = await db.get("movies", query).catch((err) => {
    next(err);
  });
  res.send(result);
});

app.use(routeErrorHandler);

module.exports = app;
