// Database
const query = require('../../core/database');

class Expenses {
  /*
   * Get all bill categories
   * @return {object} Bill categories
   */
  async getBillCategories() {
    return await query(
      `SELECT 
          PE.id, PE.categoryName
        FROM 
        tb_plugin_expenses_categories AS PE`
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the categories
          return result;
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all the available bills for the group
   * @return {object} List of Bills
   */
  async getBills(userId, circleId) {
    return await query(
      `SELECT 
              PE.id, PE.billName, PE.billAmount, PE.billCategoryId, EC.categoryNAme, PE.billDate
              FROM 
              tb_plugin_expenses AS PE INNER JOIN tb_circle_member AS CM 
              on PE.circleId = CM.circleId INNER JOIN tb_plugin_expenses_categories AS EC  on PE.billCategoryId = EC.id where CM.userId = ? AND CM.circleId = ? order by PE.billDate DESC`,
      [userId, circleId]
    )
      .then((bills) => {
        // Check if has result
        if (bills != null && bills.length > 0) {
          // Return the bills
          return bills;
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
  async addBill(
    circleId,
    userId,
    billName,
    billAmount,
    billCategoryId,
    billDate
  ) {
    return await query(
      `INSERT INTO tb_plugin_expenses
          ( circleId,
            userId,
            billName,
            billAmount,
            billCategoryId,
            billDate) 
        VALUES 
          (?, ?, ?, ?, ?, ?)`,
      [circleId, userId, billName, billAmount, billCategoryId, billDate]
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
