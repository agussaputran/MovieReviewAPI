const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.get("/reviews", async (req, res, next) => {
  const query = req.query;
  const result = await db.get("reviews", query).catch((err) => {
    next(err);
  });

  if (result == "") {
    res.status(404).send("data not found");
    return;
  }
  res.send(result);
});

app.use(routeErrorHandler);

module.exports = app;
