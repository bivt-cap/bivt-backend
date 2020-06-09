/**
 * Data access layer related to the Shopping List Plugin
 *
 * @version 0.0.1
 * @author Eduardo Pereira do Carmo (https://github.com/eduardopcarmo)
 */

// Database
const query = require('../../core/database');

/*
 * Shopping List
 */
class ShoppingList {
  /*
   * Add a new Shopping List Item
   * @param userId {int} User Id
   * @param circleId {int} Circle Id
   * @param description {string} Description of the item
   * @return {int} Id of the new Shopping LIst item
   */
  async add(userId, circleId, description) {
    return await query(
      `INSERT INTO tb_plugin_shopping 
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
   * Add a Photo Path to The Shopping List item
   * @param id {int} Shoppint list Item Id
   * @param circleId {int} Circle Id
   * @param photoPath {string} Path of the Photo in our server
   * @return void
   */
  async setPhotoPath(id, circleId, photoPath) {
    return await query(
      `UPDATE tb_plugin_shopping SET photoId = uuid(), photoPath = ? WHERE id = ? AND circleId = ? `,
      [photoPath, id, circleId]
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
   * Update a Shopping List Item
   * @param id {int} Shoppint list Item Id
   * @param circleId {int} Circle Id
   * @param description {string} Description of the item
   * @return void
   */
  async update(id, circleId, description) {
    return await query(
      `UPDATE tb_plugin_shopping SET description = ? WHERE id = ? AND circleId = ? `,
      [description, id, circleId]
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
   * Mark an item as purchased
   * @param id {int} Shoppint list Item Id
   * @param userId {int} User Id
   * @param circleId {int} Circle Id
   * @param price {decimal(15,2)} Price of the item
   * @return void
   */
  async markAsPurchased(id, userId, circleId, price) {
    return await query(
      `UPDATE tb_plugin_shopping SET purchasedOn = NOW(), purchasedBy = ?, purchasedPrice = ? WHERE id = ? AND circleId = ? `,
      [userId, price, id, circleId]
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
   * Delete a Shopping list item
   * @param id {int} Todo Id
   * @param userId {int} User Id
   * @param circleId {int} Circle Id
   * @return void
   */
  async remove(id, userId, circleId) {
    return await query(
      `UPDATE tb_plugin_shopping SET removedOn = NOW(), removedBy = ? WHERE id = ? AND circleId = ? `,
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

  /*
   * Get all active shopping list itens
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {array} List of Shopping list Itens
   */
  async getAllActiveItens(circleId, userId) {
    return await query(
      `SELECT 
          DISTINCT
              PS.id
              , PS.description 
              , PS.photoId AS photoUrl
              , PS.createdOn
              , CONCAT(CRU.firstName, ' ', CRU.lastName) AS createdBy
              , PS.purchasedOn 
              , TRIM(CONCAT(PUU.firstName, ' ', PUU.lastName)) AS purchasedBy
              , PS.purchasedPrice
              , PS.removedOn 
              , TRIM(CONCAT(REU.firstName, ' ', REU.lastName)) AS removedBy
          FROM 
              tb_plugin_shopping AS PS
              INNER JOIN tb_circle AS C ON PS.circleId = C.id
              INNER JOIN tb_circle_member AS CM ON C.id = CM.circleId
              INNER JOIN tb_user AS CRU ON PS.createdBy = CRU.id
              LEFT JOIN tb_user AS PUU ON PS.purchasedBy = PUU.id
              LEFT JOIN tb_user AS REU ON PS.removedBy = REU.id
          WHERE
              PS.circleId = ?
              AND CM.userId = ?
              AND (purchasedOn IS NULL OR purchasedOn > NOW() - INTERVAL 7 DAY)
              AND (removedOn IS NULL OR removedOn > NOW() - INTERVAL 7 DAY)`,
      [circleId, userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((item) => {
            return { ...item };
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
   * Get shopping list iten
   * @param photoId {string} Photo Id
   * @return {object} Shopping Item
   */
  async getShoppingItemByPhotoId(photoId, userId) {
    return await query(
      `SELECT 
          DISTINCT
              PS.id
              , PS.description 
              , PS.photoId
              , PS.photoPath
              , PS.createdOn
              , CONCAT(CRU.firstName, ' ', CRU.lastName) AS createdBy
              , PS.purchasedOn 
              , TRIM(CONCAT(PUU.firstName, ' ', PUU.lastName)) AS purchasedBy
              , PS.purchasedPrice
              , PS.removedOn 
              , TRIM(CONCAT(REU.firstName, ' ', REU.lastName)) AS removedBy
          FROM 
              tb_plugin_shopping AS PS
              INNER JOIN tb_circle AS C ON PS.circleId = C.id
              INNER JOIN tb_circle_member AS CM ON C.id = CM.circleId
              INNER JOIN tb_user AS CRU ON PS.createdBy = CRU.id
              LEFT JOIN tb_user AS PUU ON PS.purchasedBy = PUU.id
              LEFT JOIN tb_user AS REU ON PS.removedBy = REU.id
          WHERE
              PS.photoId = ?
              AND CM.userId = ?
              AND (purchasedOn IS NULL OR purchasedOn > NOW() - INTERVAL 7 DAY)
              AND (removedOn IS NULL OR removedOn > NOW() - INTERVAL 7 DAY)`,
      [photoId, userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((item) => {
            return { ...item };
          })[0];
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
module.exports = ShoppingList;
