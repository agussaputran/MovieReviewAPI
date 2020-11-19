const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.get("/movies/detail", async (req, res, next) => {
  const id = req.query.id;

  const getMovieDetail = await db.getMovieDetail(id).catch((err) => {
    next(err);
  });
  if (getMovieDetail.length == 0) {
    res.status(404).send("ERR_DATA_NOT_FOUND");
    return;
  }
  res.send(getMovieDetail);
});

app.use(routeErrorHandler);

module.exports = app;
