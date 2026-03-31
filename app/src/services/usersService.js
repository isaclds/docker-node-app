import UserRepository from "../repositories/UserRepository.js";
import criarResposta from "../utils/criarResposta.js";

async function create(req) {}

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
      "An unexpected error occurred while retrieving posts.",
      error,
      500,
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
