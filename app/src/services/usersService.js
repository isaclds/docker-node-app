import UserRepository from "../repositories/UserRepository.js";

async function create(req) {}

async function listAll(req) {
  try {
    const response = await UserRepository.findAllUsers();

    return {
      success: true,
      title: "All Users retrieved successfully.",
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

async function listOne(req) {}

export { create, listAll, listOne };
