const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.get("/reviews", async (req, res, next) => {
  //const userId = req.user.id;
  const query = req.query;

  if (Object.keys(query).length == 0) {
    res.status(406).send("NOT ACCEPTABLE");
    return;
  }

  const result = await db.get("reviews", query).catch((err) => {
    next(err);
  });
  if (result.length == 0) {
    res.status(404).send("data not found");
  }
  res.send(result);
});

app.use(routeErrorHandler);

module.exports = app;
