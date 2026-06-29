import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createUsers,
  login,
  changePassword,
  listOneUsers,
  updateUser,
  deleteUser,
  listAllUsers,
} from "../controllers/usersController.js";

const routes = express.Router();


routes.post("/register", createUsers);

routes.post("/login", login);

//Protected (JWT Required)
routes.use(authenticateToken);

routes.get("/", listAllUsers);

routes.put("/change-password", changePassword);

routes.put("/", updateUser);

routes.get("/:id", listOneUsers);

routes.delete("/:id", deleteUser);

export default routes;
