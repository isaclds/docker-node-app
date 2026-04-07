import AppError from "../errors/AppError.js";

export default function checkBody(body, keys) {
  if (!body || typeof body !== "object") {
    throw new AppError(
      "Request body is missing",
      400,
      "The request must include a valid body.",
    );
  }

  const errors = [];

  keys.forEach((key) => {
    if (!(key in body)) {
      errors.push(key);
      return;
    }
    if (body[key] === "") errors.push(key);
  });

  if (errors.length > 0) {
    throw new AppError(
      "Missing required fields",
      400,
      `Missing fields or values: ${errors.join(", ")}`,
    );
  }
}
