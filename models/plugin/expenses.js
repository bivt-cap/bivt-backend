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
              on PE.circleId = CM.circleId INNER JOIN tb_plugin_expenses_categories AS EC  on PE.billCategoryId = EC.id WHERE CM.userId = ? AND CM.circleId = ? ORDER BY PE.billDate DESC`,
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

  /**
   * Adds a bill
   * @param  circleId
   * @param  userId
   * @param  billName
   * @param  billAmount
   * @param  billCategoryId
   * @param  billDate
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

  /**
   * Removes a bill
   * @param userId
   * @param billId
   * @param circleId
   */
  async removeBill(userId, billId, circleId) {
    return await query(
      `DELETE from tb_plugin_expenses WHERE id = ? AND circleId=?`,
      [billId, circleId]
    )
      .then((result) => {
        if (result != null) {
          return parseInt(result.affectedRows);
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
