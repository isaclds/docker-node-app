import { getPostById } from "../services/postsService.js";
import criarResposta from "../utils/criarResposta.js";

async function createPost(req, res) {
  try {
  } catch {}
}

async function listAllPosts(req, res) {
  try {
  } catch {}
}

async function listOnePost(req, res) {
  try {
    const response = await getPostById(req);
    logger.info("Entrou");
    res.status(response.status).json(response);
  } catch {
    const response = criarResposta(
      false,
      "Internal Error",
      "Not expected Internal Error",
      500,
    );
    res.status(response.status).json(response);
  }
}

/*
static async cadastrarAutor(req, res) {
	try {
		const novoAutor = await autor.create(req.body);
		res
			.status(201)
			.json({ message: 'Cadastrado com sucesso', autor: novoAutor });
	} catch (erro) {
		res.status(500).json({
			message: `${erro.message} - FALHA AO CADASTRAR AUTOR`,
		});
	}
}
*/

export { createPost, listAllPosts, listOnePost };
