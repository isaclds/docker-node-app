import PostRepository from "../repositories/PostRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import AppError from "../errors/AppError.js";
import criarResposta from "../utils/criarResposta.js";
import checkBody from "../utils/checkBody.js";
import { logger } from "../utils/logger.js";

async function getAllPosts(req) {
  try {
    const response = await PostRepository.findAll();

    return criarResposta(
      true,
      "All posts retrieved successfully.",
      response,
      200,
    );
  } catch (error) {
    logger.info(`Error: `, error);

    return criarResposta(
      false,
      "An unexpected error occurred while retrieving posts.",
      error,
      500,
    );
  }
}

async function getPostById(req) {
  try {
    const id = req?.params?.id;
    if (!id) throw new AppError("Post ID is required.", 400);

    logger.info(`Post Id: ${id}`);

    const response = await PostRepository.findById(id);
    if (!response)
      throw new AppError("No post was found with the provided ID.", 404);

    return criarResposta(true, "Post retrieved successfully.", response, 200);
  } catch (error) {
    logger.info(`Error: `, error);

    return criarResposta(
      false,
      error.title || "An unexpected error occurred while retrieving the post.",
      error.message || error,
      error.status || 500,
    );
  }
}

async function createPost(req) {
  /*
  email
  title
  content
  */
  try {
    const body = req.body;
    logger.info("Body received: ", body);

    if (!body)
      throw new AppError(
        "Request body is missing.",
        400,
        "The request must include a body.",
      );

    checkBody(body, ["email", "title", "content"]);

    const email = body.email;
    const title = body.title;
    const content = body.content;

    const user = await UserRepository.findByEmail(email);

    const response = await PostRepository.create(user.id, title, content);

    if (!response.id)
      throw new AppError(
        "Failed to create post.",
        400,
        "The post could not be created. Please try again.",
      );

    return criarResposta(true, "Post created successfully.", response, 201);
  } catch (error) {
    logger.info(`Error: `, error);

    return criarResposta(
      false,
      error.title || "An unexpected error occurred while creating the post.",
      error.message || error,
      error.status || 500,
    );
  }
}

export { getAllPosts, getPostById, createPost };
