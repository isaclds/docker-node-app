import createResponse from "../utils/createResponse.js";
import jwt from "jsonwebtoken";

async function authenticateToken(req, res, next) {
  const token = req.headers["authorization"] || req.headers["Authorization"];

  if (!token) {
    const returnData = createResponse(
      false,
      "Access denied. No token provided.",
      null,
      401,
    );
    return res.status(returnData.status).json(returnData);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const returnData = createResponse(false, "Token expired", null, 401);
      return res.status(returnData.status).json(returnData);
    }

    const returnData = createResponse(false, "Invalid token", null, 403);
    return res.status(returnData.status).json(returnData);
  }
}

export { authenticateToken };
