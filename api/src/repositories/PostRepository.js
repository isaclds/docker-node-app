import { Posts } from "../models/index.js";
import BaseRepository from "./BaseRepository.js";

class PostRepository extends BaseRepository {
  constructor() {
    super(Posts);
  }

  async findWithAuthor(id) {
    return this.findById(id, {
      include: [{ association: "author", attributes: ["email"] }],
    });
  }

  async findAllWithAuthor() {
    return this.findAll({
      include: [
        {
          association: "author",
          attributes: ["email"],
        },
      ],
    });
  }

  async findByTitle(title) {
    return this.findAll({ where: { title } });
  }
}

export default new PostRepository();
