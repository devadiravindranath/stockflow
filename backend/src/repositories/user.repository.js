const db = require('../config/database');

class UserRepository {
  /**
   * Find a user by their email address.
   * @param {string} email - Email address to search for.
   * @returns {object|null} The user record, or null if not found.
   */
  findByEmail(email) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const user = stmt.get(email);
      return user || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Insert a new user into the database.
   * @param {object} userData - Details of the user to insert.
   * @param {string} userData.name - User's full name.
   * @param {string} userData.email - User's unique email.
   * @param {string} userData.password - Hashed password.
   * @param {string} [userData.role='owner'] - User's role inside their organization.
   * @returns {object} The created user object (excluding password).
   */
  create({ name, email, password, role = 'owner' }) {
    try {
      const stmt = db.prepare(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(name, email.toLowerCase().trim(), password, role);
      
      return {
        id: info.lastInsertRowid,
        name,
        email: email.toLowerCase().trim(),
        role,
        organization_id: null,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a user by their unique primary key ID.
   * @param {number|string} id - The user ID.
   * @returns {object|null} The user record, or null if not found.
   */
  findById(id) {
    try {
      const stmt = db.prepare('SELECT id, name, email, organization_id, role, created_at, updated_at FROM users WHERE id = ?');
      const user = stmt.get(id);
      return user || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update the user's organization.
   * @param {number|string} userId - The user ID.
   * @param {number|string} organizationId - The organization ID.
   * @returns {void}
   */
  updateOrganization(userId, organizationId) {
    try {
      const stmt = db.prepare('UPDATE users SET organization_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run(organizationId, userId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
