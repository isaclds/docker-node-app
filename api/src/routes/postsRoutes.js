import express from "express";
import {
  createPost,
  listAllPosts,
  listOnePost,
} from "../controllers/postsController.js";

const routes = express.Router();

routes.get("/:id", listOnePost);
routes.get("/", listAllPosts);

routes.post("/", createPost);

export default routes;
