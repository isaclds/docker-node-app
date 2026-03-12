import express from "express";
import posts from "./postsRoutes.js";

const routes = (app) => {
  (app.route("/").get((req, res) => {
    // healthcheck
    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  }),
    app.use(express.json(), posts));
};

export default routes;
