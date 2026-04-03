import AppError from "../errors/AppError.js";
import { Users } from "../models/index.js";
import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(Users);
  }

  async create(data) {
    const instance = await super.create(data);
    const { password, ...userWithoutPassword } = instance.toJSON();
    return userWithoutPassword;
  }

  async findById(id) {
    return super.findById(id);
  }

  async findAllUsers() {
    return this.findAll();
  }

  async findByEmail(email) {
    return this.model.scope("withPassword").findOne({ where: { email } });
  }

  async findActiveUser() {
    return this.findAll({
      where: { isActive: true },
    });
  }

  async findWithPosts(id) {
    return this.findById(id, {
      include: [{ association: "posts" }],
    });
  }
}

export default new UserRepository();
