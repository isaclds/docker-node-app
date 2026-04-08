import PostRepository from "../repositories/PostRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import AppError from "../errors/AppError.js";
import createResponse from "../utils/createResponse.js";
import checkBody from "../utils/checkBody.js";
import { logger } from "../utils/logger.js";

async function getAllPosts(req) {
  try {
    const response = await PostRepository.findAllWithAuthor();

    return {
      success: true,
      title: "All posts retrieved successfully.",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    return createResponse(
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

    const response = await PostRepository.findWithAuthor(id);
    if (!response)
      throw new AppError("No post was found with the provided ID.", 404);

    return {
      success: true,
      title: "Post retrieved successfully.",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    return createResponse(
      false,
      error.title || "An unexpected error occurred while retrieving the post.",
      error.message || error,
      error.status || 500,
    );
  }
}

async function create(req) {
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

    const response = await PostRepository.create({
      userId: user.id,
      title: title,
      content: content,
    });

    if (!response.id)
      throw new AppError(
        "Failed to create post.",
        400,
        "The post could not be created. Please try again.",
      );

    return {
      success: true,
      title: "Post created successfully.",
      data: response,
      status: 201,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    return createResponse(
      false,
      error.title || "An unexpected error occurred while creating the post.",
      error.message || error,
      error.status || 500,
    );
  }
}

async function getPostsByAuthor(req) {
  try {
    const userId = req?.params?.userId;
    if (!userId)
      throw new AppError(
        "User ID is required.",
        400,
        "The request must include a user ID.",
      );

    const response = await PostRepository.findAllByAuthor(userId);

    return {
      success: true,
      title: "Posts retrieved successfully.",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    return createResponse(
      false,
      error.title || "An unexpected error occurred while retrieving posts.",
      error.message || error,
      error.status || 500,
    );
  }
}

async function update(req) {
  try {
  } catch (error) {}
}

async function remove(req) {
  try {
  } catch (error) {}
}

async function search(req) {
  try {
  } catch (error) {}
}

export {
  getPostById,
  getAllPosts,
  create,
  getPostsByAuthor,
  update,
  remove,
  search,
};
