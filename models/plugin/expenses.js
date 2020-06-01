// Database
const query = require('../../core/database');

class Expenses {
  /*
   * Add a Plugin to a Circle
   * @param id {int} Plugin Id
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {int} Id of the new PluginCircle
   */
  async addBill(
    circleId,
    userId,
    billName,
    billAmount,
    billCategory,
    billDate
  ) {
    return await query(
      `INSERT INTO tb_plugin_expenses
          ( circleId,
            userId,
            billName,
            billAmount,
            billCategory,
            billDate) 
        VALUES 
          (?, ?, ?, ?, ?, ?)`,
      [circleId, userId, billName, billAmount, billCategory, billDate]
    )
      .then((result) => {
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
}

// Export
module.exports = Expenses;
