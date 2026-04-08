import {
  getPostById,
  getAllPosts,
  create,
  getPostsByAuthor,
  update,
  remove,
  search,
} from "../services/postsService.js";
import createResponse from "../utils/createResponse.js";

async function createPost(req, res) {
  try {
    const response = await create(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function listAllPosts(req, res) {
  try {
    const response = await getAllPosts(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function listOnePost(req, res) {
  try {
    const response = await getPostById(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function listByAuthor(req, res) {
  try {
    const response = await getPostsByAuthor(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function updatePost(req, res) {
  try {
    const response = await update(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function deletePost(req, res) {
  try {
    const response = await remove(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function searchPosts(req, res) {
  try {
    const response = await search(req);
    res.status(response.status).json(response);
  } catch (error) {
    const response = createResponse(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

export {
  createPost,
  listAllPosts,
  listOnePost,
  listByAuthor,
  updatePost,
  deletePost,
  searchPosts,
};
