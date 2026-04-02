class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(where, options = {}) {
    return this.model.findOne({ where, ...options });
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    const record = await this.findById(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await this.findById(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }

  async count(where = {}) {
    return this.model.count({ where });
  }
}

export default BaseRepository;
