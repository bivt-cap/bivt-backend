// Database
const query = require('../../core/database');

/*
 * Plugin
 */
class Plugin {
  /*
   * Get all active plugins
   * @return {array} List of active Plugins
   */
  async getAllActive() {
    return await query(
      `SELECT 
            P.id,
            P.name,
            P.price
        FROM 
            tb_plugin AS P
        WHERE
            P.inactivatedOn IS NULL`
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found circle
          return result.map((plugin) => {
            return { ...plugin };
          });
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all Plugins related to a Circle
   * @param circleId {int} Circle Id
   * @return {array} List of active Plugins ID
   */
  async getAllPluginsInCircle(circleId) {
    return await query(
      `SELECT 
          P.id
        FROM 
          tb_circle_plugin AS CP
            INNER JOIN tb_plugin AS P ON CP.pluginId = P.id
        WHERE
          CP.inactivatedOn IS NULL
            AND P.inactivatedOn IS NULL
            AND CP.circleId = ?`,
      [circleId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found circle
          return result.map((pluginId) => {
            return { ...pluginId };
          });
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Add a Plugin to a Circle
   * @param id {int} Plugin Id
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {int} Id of the new PluginCircle
   */
  async addPluginToCircle(id, circleId, userId) {
    return await query(
      `INSERT INTO tb_circle_plugin 
          (circleId, pluginId, createdBy) 
        VALUES 
          (?, ?, ?)`,
      [circleId, id, userId]
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
   * Remove a Plugin From a Circle
   * @param id {int} Plugin Id
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return void
   */
  async deletePluginToCircle(id, circleId, userId) {
    return await query(
      `UPDATE tb_circle_plugin SET inactivatedOn = NOW(), inactivatedBy = ? WHERE pluginId = ? AND circleId = ? AND inactivatedOn IS NULL `,
      [userId, id, circleId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export
module.exports = Plugin;
