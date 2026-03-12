import { Post } from "../models/index.js";
import BaseRepository from "./BaseRepository.js";

class PostRepository extends BaseRepository {
  constructor() {
    super(Post);
  }

  async findWithAuthor(id) {
    return this.findById(id, {
      include: [{ association: "author" }],
    });
  }

  async findByTitle(title) {
    return this.findAll({ where: { title } });
  }
}

export default PostRepository;
