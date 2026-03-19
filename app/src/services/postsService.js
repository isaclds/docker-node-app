import PostRepository from "../repositories/PostRepository.js";
import AppError from "../errors/AppError.js";
import criarResposta from "../utils/criarResposta.js";
import { logger } from "../utils/logger.js";

async function getPostById(req) {
  try {
    const id = req?.params?.id;
    if (!id) throw new AppError("Posts ID is required", 400);

    logger.info(`Post Id: ${id}`);

    const response = await PostRepository.findById(id);
    if (!response) throw new AppError("Post ID doesn't exist", 404);

    return criarResposta(true, "Post found!", response, 200);
  } catch (error) {
    const resposta = criarResposta(false, "Internal Server Error", error, 500);

    if (error instanceof AppError) {
      resposta.title = error.message;
      resposta.status = error.statusCode;
    }

    logger.error(`Error: `, error);
    return resposta;
  }
}

export { getPostById };
