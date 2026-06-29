import express from "express";
import posts from "./postsRoutes.js";
import users from "./usersRoutes.js";
import swaggerSpec from "../config/swagger.js";
import swaggerUi from "swagger-ui-express";

const routes = (app) => {
  app.get("/health", (req, res) => {
    res.status(200).json({ success: true });
  });
  app.use(express.json());
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/posts", posts);
  app.use("/users", users);
};

export default routes;
