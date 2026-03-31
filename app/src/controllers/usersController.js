import { create, listAll, listOne } from "../services/usersService.js";

async function createUsers(req, res) {}

async function listAllUsers(req, res) {
  try {
    const response = await listAll(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = criarResposta(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function listOneUsers(req, res) {
  try {
    const response = await listOne(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = criarResposta(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

export { createUsers, listAllUsers, listOneUsers };
