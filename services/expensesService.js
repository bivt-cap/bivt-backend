// Model
const Expenses = require('../models/plugin/expenses');

// Custom Exception
const BvitError = require('../core/express/bvitError');

/*
 * Business Logic
 */
class ExpensesService {
  constructor() {
    this.ExpensesModel = new Expenses();
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
      .catch((error) => {
        if (error.sqlMessage.includes('a foreign key constraint fails')) {
          throw new BvitError(404, 'Circle not found');
        } else {
          throw new BvitError(500, 'Error occured, please try again');
        }
      });
  }
}

// Export the service class
module.exports = ExpensesService;
