import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import AppError from "../errors/AppError.js";
import createResponse from "../utils/createResponse.js";
import checkBody from "../utils/checkBody.js";
import { logger } from "../utils/logger.js";

async function createUsers(req) {
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
      return createResponse(false, error.title, error.message, error.status);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return createResponse(
        false,
        "Duplicate entry",
        "Email already exists",
        409,
      );
    }

    if (error.name === "SequelizeValidationError") {
      return createResponse(
        false,
        "Validation error",
        error.errors.map((e) => e.message).join(", "),
        400,
      );
    }

    return createResponse(
      false,
      "Internal server error",
      "An unexpected error occurred while creating user",
      500,
    );
  }
}

async function login(req) {
  try {
    const body = req.body;
    if (!body)
      throw new AppError(
        "Request body is missing.",
        400,
        "The request must include a body.",
      );

    checkBody(body, ["email", "password"]);

    const email = body.email;
    const password = body.password;

    const user = await UserRepository.findByEmail(email);

    if (!user)
      throw new AppError(
        "The user doesn't exists",
        404,
        "The user couldn't be found.",
      );

    const isValid = await bcrypt.compare(password, user.password);

    logger.info(user.password);

    if (!isValid)
      throw new AppError(
        "Invalid Password",
        401,
        "The provided password is wrong",
      );

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      },
    );

    return {
      success: true,
      title: "Login successfully!",
      data: token,
      status: 200,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    return createResponse(
      false,
      error.title || "An unexpected error occurred while trying to login",
      error.message || error,
      error.status || 500,
    );
  }
}

async function changePassword(req) {
  // TODO: Implement changePassword logic
}

async function listOneUsers(req) {
  try {
    const id = req?.params?.id;
    if (!id) throw new AppError("User ID is required.", 400);

    const response = await UserRepository.findById(id);
    if (!response)
      throw new AppError("No user was found with the provided ID.", 404);

    return {
      success: true,
      title: "User retrieved successfully.",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    return createResponse(
      false,
      error.title || "An unexpected error occurred while retrieving the User.",
      error.message || error,
      error.status || 500,
    );
  }
}

async function updateUser(req) {
  // TODO: Implement updateUser logic
}

async function deleteUser(req) {
  // TODO: Implement deleteUser logic
}

async function listAllUsers(req) {
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

    return createResponse(
      false,
      error.title || "An unexpected error occurred while retrieving the User.",
      error.message || error,
      error.status || 500,
    );
  }
}

export {
  createUsers,
  login,
  getProfile,
  changePassword,
  listOneUsers,
  updateUser,
  deleteUser,
  listAllUsers,
};
