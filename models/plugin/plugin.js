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
}

// Export
module.exports = Plugin;
