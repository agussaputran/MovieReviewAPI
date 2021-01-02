const express = require("express");
const app = express.Router();
const passport = require("../../../middleware/authorizationMiddleware");
const routeErrorHandler = require("../../../middleware/errorMiddleware");

app.use(passport.authenticate("bearer", { session: false }));

app.post("/admin/movies", async (req, res, next) => {});

app.use(routeErrorHandler);

module.exports = app;
