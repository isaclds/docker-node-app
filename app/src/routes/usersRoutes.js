import express from "express";
import {
  createUsers,
  listAllUsers,
  listOneUsers,
} from "../controllers/usersController.js";

const routes = express.Router();

routes.get("/:id", listOneUsers);
routes.get("/", listAllUsers);

routes.post("/", createUsers);

export default routes;
