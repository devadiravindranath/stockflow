const db = require('../config/database');

class OrganizationRepository {
  async create(organizationData) {
    const { name, slug } = organizationData;
    const stmt = db.prepare(
      'INSERT INTO organizations (name, slug) VALUES (?, ?)'
    );
    const info = stmt.run(name, slug);
    return this.findById(info.lastInsertRowid);
  }

  async findById(id) {
    const stmt = db.prepare('SELECT * FROM organizations WHERE id = ?');
    return stmt.get(id);
  }

  async findBySlug(slug) {
    const stmt = db.prepare('SELECT * FROM organizations WHERE slug = ?');
    return stmt.get(slug);
  }
}

module.exports = new OrganizationRepository();
