const express = require("express");
const MovieController = require("../../controller/Movies/movieController");
const app = express.Router();
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.get(
  "/movies",
  passport.authenticate("bearer", { session: false }),
  async (req, res, next) => {
    try {
      const movie = new MovieController(req.query).looseValidate();
      res.status(200).send(await movie.find());
    } catch (error) {
      next(error);
    }
  }
);

app.use(routeErrorHandler);

module.exports = app;
