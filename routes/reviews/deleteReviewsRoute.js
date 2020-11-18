const express = require("express");
const app = express.Router();
const db = require("../../controller/authOrCanUseGlobal/dbController");
const passport = require("../../middleware/authorizationMiddleware");
const errorMiddleware = require("../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.delete("/reviews", async (req, res, next) => {
  const query = req.query;
  const id = query.id;

  try {
    await db.remove("reviews", id);
    res.send("ok");
  } catch (error) {
    next(error);
  }
});
app.use(errorMiddleware);

module.exports = app;
