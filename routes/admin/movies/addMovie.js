const express = require("express");
const MovieController = require("../../../controller/Movies/movieController");
const app = express.Router();
const passport = require("../../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../../middleware/errorMiddleware");

app.post(
  "/admin/movies",
  passport.authenticate("bearer", { session: false }),
  async (req, res, next) => {
    try {
      const movie = new MovieController({ ...req.body }).validate();
      await movie.create();

      res.status(200).send(movie.body);
    } catch (error) {
      next(error);
    }
  }
);

app.use(routeErrorHandler);

module.exports = app;
