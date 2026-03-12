import postsService from "../services/postsService.js";

function createPost(req, res) {
  try {
  } catch {}
}

function listAllPosts(req, res) {
  try {
  } catch {}
}

function listOnePost(req, res) {
  try {
  } catch {}
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
