const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const inserNowDate = require("../../helper/inserDateHelper");
const passport = require("../../middleware/authorizationMiddleware");
const errorMiddleware = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.post("/reviews/:movie_id", async (req, res, next) => {
  let body = req.body;
  let userId = (body.userId = req.user.id);
  let movieId = (body.movie_id = req.params.movie_id);
  body.date = inserNowDate();

  const isReviewed = await db
    .get("reviews", { movieId, userId })
    .catch((err) => {
      next(err);
    });

  if (isReviewed && isReviewed.length) {
    res.status(409).send("you only can add one reviews");
    return;
  }

  const result = await db.add("reviews", body).catch((err) => {
    next(err);
  });
  res.send(result);
});
app.use(errorMiddleware);

module.exports = app;
