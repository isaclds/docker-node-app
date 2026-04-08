import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import AppError from "../errors/AppError.js";
import createResponse from "../utils/createResponse.js";
import checkBody from "../utils/checkBody.js";
import removePassword from "../utils/removePassword.js";
import { checkOwnership } from "../utils/validate.js";
import { logger } from "../utils/logger.js";

async function createUsers(req) {
  try {
    const body = req.body;
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
    checkBody(body, ["password", "passwordConfirmation"]);

    const authenticatedUserId = req.user.id;
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

    const user = await UserRepository.findById(authenticatedUserId);

    if (!user)
      throw new AppError("User not found", 404, "The user couldn't be found.");

    const encryptedPassword = await bcrypt.hash(password, 10);
    const updatePassword = await UserRepository.updatePassword(
      authenticatedUserId,
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
  try {
    const id = req?.params?.id;

    if (!id)
      throw new AppError(
        "User ID is required in params.",
        400,
        "Please provide the ID of the user to update in the URL parameters.",
      );

    const authenticatedUserId = req.user.id; // From auth middleware
    checkOwnership(authenticatedUserId, id);

    const body = req.body;
    checkBody(body, ["password", "update"]);

    const password = body.password;
    const updateData = body.update || {};

    const validFields = ["name", "email"];
    const isValidOperation = Object.keys(updateData).every((field) =>
      validFields.includes(field),
    );

    if (!isValidOperation)
      throw new AppError(
        "Invalid update fields",
        400,
        `Only the following fields can be updated: ${validFields.join(", ")}`,
      );

    if (Object.keys(updateData).length === 0) {
      throw new AppError(
        "No updates provided",
        400,
        "At least one field to update is required",
      );
    }

    const user = await UserRepository.findById(id);

    if (!user)
      throw new AppError("User not found", 404, "The user couldn't be found.");

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      throw new AppError(
        "Invalid Password",
        401,
        "The provided password is wrong",
      );

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await UserRepository.findByEmail(updateData.email);
      if (existingUser) {
        throw new AppError(
          "Email already exists",
          409,
          "The email address is already registered to another account",
        );
      }
    }

    const updatedUser = await UserRepository.update(user.id, updateData);
    const response = removePassword(updatedUser);

    return {
      success: true,
      title: "User updated successfully",
      data: response,
      status: 200,
    };
  } catch (error) {
    console.error("Update user error:", error);

    // Handle specific error types
    if (error instanceof AppError) {
      return {
        success: false,
        title: error.title || "Update failed",
        message: error.message,
        status: error.status || 400,
      };
    }

    if (error.message && error.message.includes("bcrypt")) {
      return {
        success: false,
        title: "Internal server error",
        message: "Password verification failed",
        status: 500,
      };
    }

    if (error.code === "23505") {
      return {
        success: false,
        title: "Duplicate entry",
        message: "A user with this information already exists",
        status: 409,
      };
    }

    return {
      success: false,
      title: "An unexpected error occurred while trying to update the user",
      message: error.message || "Internal server error",
      status: error.status || 500,
    };
  }
}

async function deleteUser(req) {
  try {
    const id = req?.params?.id;

    if (!id)
      throw new AppError(
        "User ID is required in params.",
        400,
        "Please provide the ID of the user to delete in the URL parameters.",
      );

    const authenticatedUserId = req.user.id; // From auth middleware
    checkOwnership(authenticatedUserId, id);

    const body = req.body;
    checkBody(body, ["email", "password"]);

    const email = body.email;
    const password = body.password;

    const user = await UserRepository.findById(id);

    if (!user)
      throw new AppError("User not found", 404, "The user couldn't be found.");

    if (user.email !== email)
      throw new AppError(
        "Email mismatch",
        400,
        "The provided email does not match the user's email.",
      );

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      throw new AppError(
        "Invalid Password",
        401,
        "The provided password is wrong",
      );

    const response = await UserRepository.delete(id);
    logger.info(`User account deleted: ${email}, ${id} from IP: ${req.ip}`);

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
      error.title || "An unexpected error occurred while trying to delete user",
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
