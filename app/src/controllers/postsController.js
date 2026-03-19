import { getPostById, getAllPosts } from "../services/postsService.js";
import criarResposta from "../utils/criarResposta.js";

async function createPost(req, res) {
  try {
  } catch {}
}

async function listAllPosts(req, res) {
  try {
    const response = await getAllPosts(req);
    res.status(response.status).json(response);
  } catch {
    const response = criarResposta(false, "Internal Error", error, 500);
    res.status(response.status).json(response);
  }
}

async function listOnePost(req, res) {
  try {
    const response = await getPostById(req);
    res.status(response.status).json(response);
  } catch {
    const response = criarResposta(false, "Internal Error", error, 500);
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
