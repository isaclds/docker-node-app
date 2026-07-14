import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import AppError from "../errors/AppError.js";
import handleError from "../errors/handleError.js";
import checkBody from "../utils/checkBody.js";
import removePassword from "../utils/removePassword.js";
import { checkOwnership } from "../utils/validate.js";
import { logger } from "../utils/logger.js";

async function createUsers(req) {
  try {
    const { name, email, password } = req.body;
    checkBody(req.body, ["name", "email", "password"]);

    // TODO: implementar tratamento de email já existente
    if (await UserRepository.findByEmail(email))
      throw new AppError(
        "This email is already registered",
        409,
        "Use an different email and try again",
      );

    const response = await UserRepository.create({ name, email, password });

    if (!response.id || response instanceof Error)
      throw new AppError(
        "Failed to create user",
        400,
        "The user couldn't be created. Please try again",
      );

    logger.info(`New user registered successfully: ${response.id} (${email})`);

    return {
      success: true,
      title: "User created successfully",
      data: removePassword(response),
      status: 201,
    };
  } catch (error) {
    logger.error(`Error creating user:`, error);
    return handleError(error, "createUsers");
  }
}

async function login(req) {
  try {
    const { email, password } = req.body;
    checkBody(req.body, ["email", "password"]);

    const user = await UserRepository.findByEmail(email);

    if (!user)
      throw new AppError("User not found", 404, "The user couldn't be found.");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      throw new AppError(
        "Invalid password",
        401,
        "The provided password is wrong",
      );

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    logger.info(`User logged in successfully: ${user.id} (${user.email})`);

    return {
      success: true,
      title: "Login successfully!",
      data: token,
      status: 200,
    };
  } catch (error) {
    logger.error(`Error during login:`, error);
    return handleError(error, "login");
  }
}

async function changePassword(req) {
  try {
    const { password } = req.body;
    const id = req.user.id;
    checkBody(req.body, ["password"]);

    if (password.length < 8)
      throw new AppError(
        "Password too short",
        400,
        "Password must be at least 8 characters long",
      );

    const user = await UserRepository.findByIdWithPassword(id);
    if (!user)
      throw new AppError("User not found", 404, "The user couldn't be found.");

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword)
      throw new AppError(
        "Password already used",
        409,
        "The provided password is the same as the current one.",
      );

    const encryptedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await UserRepository.updatePassword(
      id,
      encryptedPassword,
    );

    if (!updatedUser)
      throw new AppError(
        "Couldn't update password",
        400,
        "Password update failed",
      );

    logger.info(`User changed password: ${id}`);

    return {
      success: true,
      title: "Password updated successfully!",
      data: removePassword(updatedUser),
      status: 200,
    };
  } catch (error) {
    logger.error(`Error changing password:`, error);
    return handleError(error, "changePassword");
  }
}

async function listOneUsers(req) {
  try {
    const { id } = req.params;
    if (!id)
      throw new AppError(
        "User ID is required.",
        400,
        "Provide an ID in the URL params",
      );

    const response = await UserRepository.findById(id);
    if (!response)
      throw new AppError(
        "User not found",
        404,
        "No user was found with the provided ID.",
      );

    return {
      success: true,
      title: "User retrieved successfully.",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.error(`Error retrieving user:`, error);
    return handleError(error, "listOneUsers");
  }
}

async function updateUser(req) {
  try {
    const id = req.user.id;
    checkBody(req.body, ["update"]);

    const { update: updateData = {} } = req.body;

    const validFields = ["name", "email"];
    const isValidOperation = Object.keys(updateData).every((f) =>
      validFields.includes(f),
    );
    if (!isValidOperation)
      throw new AppError(
        "Invalid update fields",
        400,
        `Only the following fields can be updated: ${validFields.join(", ")}`,
      );

    if (Object.keys(updateData).length === 0)
      throw new AppError(
        "No updates provided",
        400,
        "At least one field to update is required",
      );

    const user = await UserRepository.findByIdWithPassword(id);
    if (!user)
      throw new AppError("User not found", 404, "The user couldn't be found.");

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await UserRepository.findByEmail(updateData.email);
      if (existingUser)
        throw new AppError(
          "Email already exists",
          409,
          "The email address is already registered to another account.",
        );
    }

    const updatedUser = await UserRepository.update(id, updateData);

    logger.info(
      `User profile updated: ${id}. Fields: ${Object.keys(updateData).join(", ")}`,
    );

    return {
      success: true,
      title: "User updated successfully",
      data: removePassword(updatedUser),
      status: 200,
    };
  } catch (error) {
    logger.error(`Error updating user:`, error);
    return handleError(error, "updateUser");
  }
}

async function deleteUser(req) {
  try {
    const { id } = req.params;
    if (!id)
      throw new AppError(
        "User ID is required in params.",
        400,
        "Provide the ID of the user to delete in the URL.",
      );

    checkOwnership(req.user.id, id);
    checkBody(req.body, ["email", "password"]);

    const { email, password } = req.body;

    const user = await UserRepository.findByIdWithPassword(id);
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
        "Invalid password",
        401,
        "The provided password is wrong",
      );

    await UserRepository.delete(id);
    logger.info(`User account deleted: ${email}, ${id} from IP: ${req.ip}`);

    return { success: true, status: 204 };
  } catch (error) {
    logger.error(`Error deleting user:`, error);
    return handleError(error, "deleteUser");
  }
}

async function listAllUsers(req) {
  try {
    const response = await UserRepository.findAllUsers();
    return {
      success: true,
      title: "All users retrieved successfully",
      data: response,
      status: 200,
    };
  } catch (error) {
    logger.error(`Error listing users:`, error);
    return handleError(error, "listAllUsers");
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
