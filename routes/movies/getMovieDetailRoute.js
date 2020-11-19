const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.get("/movies/detail", async (req, res, next) => {
  const query = req.query;
  const id = query.id;

  const result = await db.get("movies", query).catch((err) => {
    next(err);
  });

  if (result.length == 0) {
    res.status(404).send("data not found");
    return;
  }

  const getMovieDetail = await db.getMovieDetail(id).catch((err) => {
    next(err);
  });
  res.send(getMovieDetail);
});

app.use(routeErrorHandler);

module.exports = app;
