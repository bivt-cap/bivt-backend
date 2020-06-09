// Database
const query = require('../../core/database');

/*
 * Todo
 */
class Todo {
  /*
   * Add a new todo to the List
   * @param userId {int} User Id
   * @param circleId {int} Circle Id
   * @param description {string} Description of the to-do
   * @return {int} Id of the new Todo
   */
  async add(userId, circleId, description) {
    return await query(
      `INSERT INTO tb_plugin_todo 
          (circleId, description, createdBy) 
        VALUES 
          (?, ?, ?)`,
      [circleId, description, userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null) {
          return parseInt(result.insertId);
        } else {
          return 0;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Mark a Todo as Done
   * @param id {int} Todo Id
   * @param userId {int} User Id
   * @return void
   */
  async markAsDone(id, userId) {
    return await query(
      `UPDATE tb_plugin_todo SET doneOn = NOW() WHERE id = ? AND createdBy = ? `,
      [id, userId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Delete a Todo
   * @param id {int} Todo Id
   * @param userId {int} User Id
   * @return void
   */
  async remove(id, userId) {
    return await query(
      `UPDATE tb_plugin_todo SET removeOn = NOW() WHERE id = ? AND createdBy = ? `,
      [id, userId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all todos
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {array} List of todos
   */
  async getAll(circleId, userId) {
    return await query(
      `SELECT 
            id,
            description, 
            CASE WHEN doneOn IS NOT NULL THEN 1 ELSE 0 END AS done, 
            CASE WHEN removeOn IS NOT NULL THEN 1 ELSE 0 END AS removed 
        FROM 
            tb_plugin_todo 
        WHERE 
            createdBy = ?
            AND circleId = ? 
            AND (doneOn IS NULL OR doneOn > NOW() - INTERVAL 7 DAY)
            AND (removeOn IS NULL OR removeOn > NOW() - INTERVAL 7 DAY)`,
      [userId, circleId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((todo) => {
            return { ...todo };
          });
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export
module.exports = Todo;
