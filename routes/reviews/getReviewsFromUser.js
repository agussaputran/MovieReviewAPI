const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.get("/reviews/user", async (req, res, next) => {
  const userId = req.user.id;
  const movieTitle = req.query.title;

  if (Object.keys(req.query).length > 0) {
    const result = await db
      .getReviewsFromUserWithTitle(userId, movieTitle)
      .catch((err) => {
        next(err);
      });
    if (result.length == 0) {
      res.status(404).send("DATA NOT FOUND");
      return;
    }
    res.send(result);
    return;
  }
  if (Object.keys(req.query).length == 0) {
    const result = await db.getReviewsFromUser(userId).catch((err) => {
      next(err);
    });
    res.send(result);
    return;
  }
});

app.use(routeErrorHandler);

module.exports = app;
