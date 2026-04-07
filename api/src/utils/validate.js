import { logger } from "./logger.js";
import AppError from "../errors/AppError.js";

/**
 * Check if the authenticated user owns the resource or is admin
 * @param {object} authenticatedUser - The authenticated user from token (req.user)
 * @param {string} dbId - The ID of the user being accessed/modified
 * @param {boolean} isAdmin - If user is admin
 * @returns {void}
 * @throws {AppError} - Throws if unauthorized
 */
export function checkOwnership(authenticatedUserId, dbId, isAdmin = false) {
  if (authenticatedUserId !== dbId && !isAdmin) {
    logger.info(
      `Unauthorized update attempt - User ${authenticatedUserId} tried to update ${dbId}`,
    );
    throw new AppError(
      "Unauthorized",
      403,
      "You can only update your own profile.",
    );
  }
}
