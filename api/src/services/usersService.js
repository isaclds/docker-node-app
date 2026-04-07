import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import AppError from "../errors/AppError.js";
import createResponse from "../utils/createResponse.js";
import checkBody from "../utils/checkBody.js";
import removePassword from "../utils/removePassword.js";
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

    const responseNoPassword = removePassword(response);

    return {
      success: true,
      title: "User created successfully",
      data: responseNoPassword,
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
      throw new AppError("User not found", 404, "The user couldn't be found.");

    const isValid = await bcrypt.compare(password, user.password);

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
  try {
    const body = req.body;
    if (!body)
      throw new AppError(
        "Request body is missing.",
        400,
        "The request must include a body.",
      );

    checkBody(body, ["email", "password", "passwordConfirmation"]);

    const email = body.email;
    const password = body.password;
    const passwordConfirmation = body.passwordConfirmation;

    if (password !== passwordConfirmation) {
      throw new AppError(
        "Passwords don't match",
        400,
        "Passwords must match to change",
      );
    }

    if (password.length < 8) {
      throw new AppError(
        "Password too short",
        400,
        "Password must be atleast 8 characters long",
      );
    }

    const user = await UserRepository.findByEmail(email);

    if (!user)
      throw new AppError("User not found", 404, "The user couldn't be found.");

    const encryptedPassword = await bcrypt.hash(password, 10);
    const updatePassword = await UserRepository.updatePassword(
      user.id,
      encryptedPassword,
    );

    if (!updatePassword)
      throw new AppError("Couldn't update password", 400, updatePassword);

    const response = removePassword(updatePassword);

    return {
      success: true,
      title: "Passowrd updated successfully!",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    if (error.message.includes("bcrypt"))
      return createResponse(
        "Internal server error",
        500,
        "Password encryption failed",
      );

    return createResponse(
      false,
      error.title ||
        "An unexpected error occurred while trying to change password",
      error.message || error,
      error.status || 500,
    );
  }
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
      throw new AppError("User not found", 404, "The user couldn't be found.");

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      throw new AppError(
        "Invalid Password",
        401,
        "The provided password is wrong",
      );

    const response = await UserRepository.delete(user.id);
    logger.info(
      `User account deleted: ${email}, ${user.id} from IP: ${req.ip}`,
    );

    return {
      success: true,
      status: 204,
    };
  } catch (error) {
    logger.info(`Error: `, error);

    if (error.message.includes("bcrypt"))
      return createResponse(
        "Internal server error",
        500,
        "Password encryption failed",
      );

    return createResponse(
      false,
      error.title ||
        "An unexpected error occurred while trying to change password",
      error.message || error,
      error.status || 500,
    );
  }
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
  changePassword,
  listOneUsers,
  updateUser,
  deleteUser,
  listAllUsers,
};
