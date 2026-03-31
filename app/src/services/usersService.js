import UserRepository from "../repositories/UserRepository.js";
import AppError from "../errors/AppError.js";
import criarResposta from "../utils/criarResposta.js";
import checkBody from "../utils/checkBody.js";
import { logger } from "../utils/logger.js";

async function create(req) {
  try {
    const body = req.body;
    if (!body)
      throw new AppError(
        "Request body is missing.",
        400,
        "The request must include a body.",
      );

    checkBody(body, ["name", "email", "password"]);

    const name = body.name;
    const email = body.email;
    const password = body.password;

    const response = await UserRepository.create({
      name: name,
      email: email,
      password: password,
    });

    if (!response.id || response instanceof Error)
      throw new AppError(
        "Failed to create user",
        400,
        "The user couldn't be created. Please try again",
      );

    return {
      success: true,
      title: "User created successfully",
      data: response,
      status: 201,
    };
  } catch (error) {
    logger.error(`Error creating user:`, error);

    if (error instanceof AppError) {
      return criarResposta(false, error.title, error.message, error.status);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return criarResposta(
        false,
        "Duplicate entry",
        "Email already exists",
        409,
      );
    }

    if (error.name === "SequelizeValidationError") {
      return criarResposta(
        false,
        "Validation error",
        error.errors.map((e) => e.message).join(", "),
        400,
      );
    }

    // Generic error
    return criarResposta(
      false,
      "Internal server error",
      "An unexpected error occurred while creating user",
      500,
    );
  }
}

async function listAll(req) {
  try {
    const response = await UserRepository.findAllUsers();

    return {
      success: true,
      title: "All Users retrieved successfully",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    return criarResposta(
      false,
      error.title || "An unexpected error occurred while retrieving the User.",
      error.message || error,
      error.status || 500,
    );
  }
}

async function listOne(req) {
  try {
    const id = req?.params?.id;
    if (!id) throw new AppError("User ID is required.", 400);

    const response = await UserRepository.findById(id);
    if (!response)
      throw new AppError("No post was found with the provided ID.", 404);

    return criarResposta(true, "User retrieved successfully.", response, 200);
  } catch {
    logger.info(`Error: `, error);

    return criarResposta(
      false,
      error.title || "An unexpected error occurred while retrieving the User.",
      error.message || error,
      error.status || 500,
    );
  }
}

export { create, listAll, listOne };
