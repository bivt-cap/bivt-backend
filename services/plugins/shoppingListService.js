/**
 * Business Logic related to the Shopping List Plugin
 *
 * @version 0.0.1
 * @author Eduardo Pereira do Carmo (https://github.com/eduardopcarmo)
 */

// Model
const ShoppingList = require('../../models/plugin/shoppingList');

// Custom Exception
const BvitError = require('../../core/express/bvitError');

/*
 * Business Logic related to the Shopping List Plugin
 */
class ShoppingListService {
  constructor() {
    this.ShoppingListModel = new ShoppingList();
  }

  /*
   * Add a new Shopping List Item
   * @param userId {int} User Id
   * @param circleId {int} Circle Id
   * @param description {string} Description of the item
   * @return {int} Id of the new Shopping LIst item
   */
  async add(userId, circleId, description) {
    return await this.ShoppingListModel.add(userId, circleId, description)
      .then((itemId) => {
        if (itemId > 0) {
          return itemId;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Add a Photo Path to The Shopping List item
   * @param id {int} Shoppint list Item Id
   * @param circleId {int} Circle Id
   * @param photoPath {string} Path of the Photo in our server
   * @return void
   */
  async setPhotoPath(id, circleId, photoPath) {
    return await this.ShoppingListModel.setPhotoPath(id, circleId, photoPath)
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Update a Shopping List Item
   * @param id {int} Shoppint list Item Id
   * @param circleId {int} Circle Id
   * @param description {string} Description of the item
   * @return void
   */
  async update(id, circleId, description) {
    return await this.ShoppingListModel.update(id, circleId, description)
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Mark an item as purchased
   * @param id {int} Shoppint list Item Id
   * @param userId {int} User Id
   * @param circleId {int} Circle Id
   * @param price {decimal(15,2)} Price of the item
   * @return void
   */
  async markAsPurchased(id, userId, circleId, price) {
    return await this.ShoppingListModel.markAsPurchased(
      id,
      userId,
      circleId,
      price
    )
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Delete a Shopping list item
   * @param id {int} Todo Id
   * @param userId {int} User Id
   * @param circleId {int} Circle Id
   * @return void
   */
  async remove(id, userId, circleId) {
    return await this.ShoppingListModel.remove(id, userId, circleId)
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all active shopping list itens
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {array} List of Shopping list Itens
   */
  async getAllActiveItens(circleId, userId) {
    return await this.ShoppingListModel.getAllActiveItens(circleId, userId)
      .then((items) => {
        if (items != null && items.length > 0) {
          return items;
        } else {
          throw new BvitError(404, 'There are no Shopping list itens.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get shopping list iten by photo id
   * @param photoId {string} Photo Id
   * @return {object} Shopping Item
   */
  async getShoppingItemByPhotoId(photoId, userId) {
    return await this.ShoppingListModel.getShoppingItemByPhotoId(
      photoId,
      userId
    )
      .then((item) => {
        if (item != null) {
          return item;
        } else {
          throw new BvitError(404, 'There are no item with this id.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = ShoppingListService;
