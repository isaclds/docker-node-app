import express from "express";
import posts from "../controllers/postsController.js";

const routes = express.Router();

routes.get("/posts/:id", listOnePost);
routes.get("/posts", listAllPosts);

routes.post("/posts", createPost);

export default routes;
