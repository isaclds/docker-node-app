import { where } from "sequelize";
import { Posts } from "../models/index.js";
import BaseRepository from "./BaseRepository.js";

class PostRepository extends BaseRepository {
  constructor() {
    super(Posts);
  }

  async findWithAuthor(id) {
    return this.findById(id, {
      include: [{ association: "author", attributes: ["email"] }],
      order: [["createdAt", "DESC"]],
    });
  }

  async findAllWithAuthor() {
    return this.findAll({
      include: [
        {
          association: "author",
          attributes: ["name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findAllByAuthor(userId) {
    return this.findAll({
      where: { userId: userId },
      include: [
        {
          association: "author",
          attributes: ["name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findByTitle(title) {
    return this.findAll({ where: { title } });
  }
}

export default new PostRepository();
