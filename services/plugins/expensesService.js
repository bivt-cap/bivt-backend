// Model
const Expenses = require('../../models/plugin/expenses');

// Custom Exception
const BvitError = require('../../core/express/bvitError');

/*
 * Business Logic
 */
class ExpensesService {
  constructor() {
    this.ExpensesModel = new Expenses();
  }

  /*
   * Return the list of all the available bill categories
   * @return List of Categories
   */
  async getBillCategories() {
    return await this.ExpensesModel.getBillCategories()
      .then((result) => {
        if (result != null && result.length > 0) {
          return result;
        } else {
          return null;
        }
      })
      .catch(() => {
        throw new BvitError(500, 'An error occurred, please try again later.');
      });
  }

  /**
   * Get all the available bills for the group
   * @param userId
   * @param circleId
   * @return List of Bills
   */
  async getBills(userId, circleId) {
    return await this.ExpensesModel.getBills(userId, circleId)
      .then((result) => {
        if (result != null && result.length >= 0) {
          return result;
        } else {
          return null;
        }
      })
      .catch(() => {
        throw new BvitError(500, 'An error occurred, please try again later.');
      });
  }

  /**
   * Adds a new bill
   * @param  circleId
   * @param  userId
   * @param  billName
   * @param  billAmount
   * @param  billCategory
   * @param  billDate
   */
  async addBill(
    circleId,
    userId,
    billName,
    billAmount,
    billCategory,
    billDate
  ) {
    return await this.ExpensesModel.addBill(
      circleId,
      userId,
      billName,
      billAmount,
      billCategory,
      billDate
    )
      .then((result) => {
        return result;
      })
      .catch(() => {
        throw new BvitError(500, 'Error occured, please try again');
      });
  }

  /**
   * removes a bill
   * @param userId
   * @param billId
   * @param circleId
   */
  async removeBill(userId, billId, circleId) {
    return await this.ExpensesModel.removeBill(userId, billId, circleId)
      .then((result) => {
        return result;
      })
      .catch(() => {
        throw new BvitError(500, 'Error occured, please try again');
      });
  }
}

// Export the service class
module.exports = ExpensesService;
