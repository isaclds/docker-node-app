import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createPost,
  listAllPosts,
  listOnePost,
  listByAuthor,
  updatePost,
  deletePost,
  searchPosts,
} from "../controllers/postsController.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts management endpoints
 */

routes.get("/search", searchPosts);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a list of all posts by user
 *     tags: [Posts]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve posts for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A JSON array of user posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
routes.get("/users/:userId", listByAuthor);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Returns a list of all posts by id
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A JSON array of user posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
routes.get("/:id", listOnePost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Returns a list of all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A JSON array of user posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
routes.get("/", listAllPosts);

//Protected (JWT Required)
routes.use(authenticateToken);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Criar um novo post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - title
 *               - content
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *                 description: E-mail do autor (deve existir no sistema)
 *               title:
 *                 type: string
 *                 example: "Meu primeiro post"
 *                 description: Título do post
 *               content:
 *                 type: string
 *                 example: "Conteúdo do post aqui..."
 *                 description: Conteúdo do post
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 title:
 *                   type: string
 *                   example: "Post created successfully."
 *                 detail:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       example: "Meu primeiro post"
 *                     content:
 *                       type: string
 *                       example: "Conteúdo do post aqui..."
 */
routes.post("/", createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualizar um post existente
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título atualizado"
 *                 description: Novo título do post
 *               content:
 *                 type: string
 *                 example: "Conteúdo atualizado aqui..."
 *                 description: Novo conteúdo do post
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 title:
 *                   type: string
 *                   example: "Post updated successfully."
 *                 detail:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       example: "Título atualizado"
 *                     content:
 *                       type: string
 *                       example: "Conteúdo atualizado aqui..."
 */
routes.put("/:id", updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Deletar um post existente
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 title:
 *                   type: string
 *                   example: "Post deleted successfully."
 *                 detail:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 */
routes.delete("/:id", deletePost);

export default routes;
