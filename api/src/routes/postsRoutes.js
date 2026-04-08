import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
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
routes.get("/users/:userId", listByAuthor);
routes.get("/:id", listOnePost);
routes.get("/", listAllPosts);

//Protected (JWT Required)
routes.use(authenticateToken);

routes.post("/", createPost);
routes.put("/:id", updatePost);
routes.delete("/:id", deletePost);

export default routes;
