import AppError from "../errors/AppError.js";

export default function checkBody(body, keys) {
  const errors = [];

  keys.forEach((key) => {
    if (!(key in body)) errors.push(key);
  });

  if (errors.length > 0) {
    throw new AppError(`Missing fields: ${errors.join(", ")}`);
  }
}
