import express from "express";
import posts from "./postsRoutes.js";
import users from "./usersRoutes.js";

const routes = (app) => {
  app.use(express.json());
  app.use("/posts", posts);
  app.use("/users", users);
};

export default routes;
