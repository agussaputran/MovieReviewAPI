const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const errorMiddleware = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.post("/reviews", async (req, res, next) => {
  let body = req.body;
  let userId = (body.userId = req.user.id);
  let movieId = body.movieId;

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
