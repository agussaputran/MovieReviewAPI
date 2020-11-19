const express = require("express");
const app = express.Router();
const paginate = require("express-paginate");
const db = require("../../controller/authOrCanUseGlobal/dbController");
const db2 = require("../../controller/Home/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.get("/reviews", paginate.middleware(5, 15), async (req, res, next) => {
  const movie_id = req.query.movieId;
  const offset = (req.query.page - 1) * req.query.limit;
  const id = "reviews.movie_id";
  const config = {
    order: "ORDER BY date DESC",
    limit: `limit ${req.query.limit}`,
    offset: `offset ${offset}`,
  };

  const result = await db
    .get("reviews", { movie_id: movie_id })
    .catch((err) => {
      next(err);
    });
  if (result.length == 0) {
    res.status(404).send("ERR_NOT_FOUND");
    return;
  }
  const result2 = await db
    .getWithPagination("reviews", movie_id, config)
    .catch((err) => {
      next(err);
    });
  const itemCount = await db2.countData(id, "reviews").catch((err) => {
    next(err);
  });
  const totalCount = itemCount[0].total;
  const pageCount = Math.ceil(totalCount / req.query.limit);

  const response = {
    movies: result2,
    pages: paginate.getArrayPages(req)(10, pageCount, req.query.page),
  };

  res.send(response);
});

app.use(routeErrorHandler);

module.exports = app;
