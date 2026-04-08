import express from "express";
import {
  createPost,
  listAllPosts,
  listOnePost,
  listByAuthor,
  updatePost,
  deletePost,
  searchPosts,
} from "../controllers/postsController.js";

const routes = express.Router();

routes.get("/search", searchPosts);
routes.get("/user/:userId", listByAuthor);
routes.get("/:id", listOnePost);
routes.get("/", listAllPosts);

routes.post("/", createPost);
routes.put("/:id", updatePost);
routes.delete("/:id", deletePost);

export default routes;
