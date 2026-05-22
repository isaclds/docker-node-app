import AppError from "./AppError.js";
import createResponse from "../utils/createResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Centralized error handler for all service functions.
 *
 * Priority order:
 *  1. AppError  — intentional throws from business logic
 *  2. Sequelize — ORM-level constraint / validation errors
 *  3. bcrypt    — password hashing / comparison failures
 *  4. JWT       — token signing / verification failures
 *  5. Fallback  — anything unexpected; never leaks internals
 */
export default function handleError(error, context = "operation") {
  if (error instanceof AppError) {
    return createResponse(false, error.title, error.message, error.status);
  }

  // ── 2. Sequelize errors ───────────────────────────────────────────────────
  if (error.name === "SequelizeUniqueConstraintError") {
    return createResponse(
      false,
      "Duplicate entry",
      "Email already exists",
      409,
    );
  }

  if (error.name === "SequelizeValidationError") {
    const message = error.errors?.map((e) => e.message).join(", ");
    return createResponse(false, "Validation error", message, 400);
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    return createResponse(
      false,
      "Reference error",
      "Related record not found",
      400,
    );
  }

  if (error.name === "SequelizeConnectionError") {
    logger.error(`[${context}] Database connection error:`, error);
    return createResponse(
      false,
      "Service unavailable",
      "Database connection failed",
      503,
    );
  }

  if (error.code === "23505") {
    return createResponse(
      false,
      "Duplicate entry",
      "A record with this information already exists",
      409,
    );
  }

  if (error.code === "23503") {
    return createResponse(
      false,
      "Reference error",
      "Related record not found",
      400,
    );
  }

  if (
    error.message?.toLowerCase().includes("bcrypt") ||
    error.message?.toLowerCase().includes("hash") ||
    error.name === "BcryptError"
  ) {
    logger.error(`[${context}] bcrypt error:`, error);
    return createResponse(
      false,
      "Internal server error",
      "Password processing failed",
      500,
    );
  }

  if (error.name === "JsonWebTokenError") {
    return createResponse(
      false,
      "Invalid token",
      "The provided token is invalid",
      401,
    );
  }

  if (error.name === "TokenExpiredError") {
    return createResponse(
      false,
      "Token expired",
      "Your session has expired, please log in again",
      401,
    );
  }

  logger.error(`[${context}] Unhandled error:`, error);
  return createResponse(
    false,
    "Internal server error",
    "An unexpected error occurred",
    500,
  );
}
