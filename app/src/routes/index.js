import express from "express";
import posts from "./postsRoutes.js";

const routes = (app) => {
  app.use(express.json(), posts);
};

export default routes;
