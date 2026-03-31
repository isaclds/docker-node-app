import { Users } from "../models/index.js";
import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(Users);
  }

  async findById(id) {
    return super.findById(id, {
      attributes: { exclude: ["password"] },
    });
  }

  async findAllUsers() {
    return this.findAll({
      attributes: { exclude: ["password"] },
    });
  }

  async findByEmail(email) {
    return this.findOne(
      { email },
      {
        attributes: { exclude: ["password"] },
      },
    );
  }

  async findActiveUser() {
    return this.findAll({
      where: { isActive: true },
      attributes: { exclude: ["password"] },
    });
  }

  async findWithPosts(id) {
    return this.findById(id, {
      include: [{ association: "posts" }],
      attributes: { exclude: ["password"] },
    });
  }
}

export default new UserRepository();
