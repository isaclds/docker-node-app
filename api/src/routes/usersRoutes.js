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

//Public
routes.post("/register", createUsers);
routes.post("/login", login);

//Protected (JWT Required)
routes.use(authenticateToken);

routes.post("/change-password", changePassword);

routes.get("/:id", listOneUsers);
routes.put("/:id", updateUser);
routes.delete("/delete", deleteUser);
routes.get("/", listAllUsers);

export default routes;
