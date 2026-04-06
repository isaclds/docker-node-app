import {
  createUsers,
  listAllUsers,
  listOneUsers,
  login,
  changePassword,
  updateUser,
  deleteUser,
} from "../services/usersService.js";
import createResponse from "../utils/createResponse.js";

async function createUsersController(req, res) {
  try {
    const response = await createUsers(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function listAllUsersController(req, res) {
  try {
    const response = await listAllUsers(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function listOneUsersController(req, res) {
  try {
    const response = await listOneUsers(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function loginController(req, res) {
  try {
    const response = await login(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function changePasswordController(req, res) {
  try {
    const response = await changePassword(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function updateUserController(req, res) {
  try {
    const response = await updateUser(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function deleteUserController(req, res) {
  try {
    const response = await deleteUser(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

export {
  createUsersController as createUsers,
  listAllUsersController as listAllUsers,
  listOneUsersController as listOneUsers,
  loginController as login,
  changePasswordController as changePassword,
  updateUserController as updateUser,
  deleteUserController as deleteUser,
};
