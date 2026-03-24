import { where } from "sequelize";
import {Users} from "../models/index.js";
import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(Users);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findActiveUser() {
    return this.findAll({ where: { isActive: true } });
  }

  async findWithPosts(id) {
    return this.findById(id, {
      include: [{ association: "posts" }],
    });
  }
}

export default new UserRepository();
