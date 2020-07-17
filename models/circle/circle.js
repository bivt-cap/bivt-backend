// Database
const query = require('../../core/database');

/*
 * Circle
 */
class Circle {
  /*
   * Get a Circle by ID
   * @param id {int} Circle Id
   * @return {object} Found circle
   */
  async getById(id) {
    return await query(
      `SELECT 
          C.id, C.name, C.createdOn, C.createdBy, C.inactivatedOn, C.inactivatedBy
        FROM 
          tb_circle AS C
        WHERE 
          id = ?`,
      [id]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found circle
          return { ...result[0] };
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get the number of Circles that the user is owner
   * @param userId {int} User Id
   * @return {int} Number of Circles that the user is owner
   */
  async getNumberCirclesByOwner(userId) {
    return await query(
      `SELECT COUNT(id) AS total FROM tb_circle WHERE createdBy = ? AND inactivatedOn IS NULL`,
      [userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the User
          return result[0].total;
        } else {
          return 0;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Return the list of all Circles that the user belongs (invited or owner)
   * @param userId {int} User Id
   * @return List of Circles
   */
  async getCirclesByUser(userId) {
    return await query(
      `SELECT 
          C.id,
          C.name,
          CASE WHEN C.createdBy = CM.userId THEN 1 ELSE 0 END AS isOwner,
          CM.joinedOn,
          CASE WHEN CM.setAsAdminOn IS NOT NULL THEN 1 ELSE 0 END AS isAdmin,
          C.image
      FROM 
          tb_circle_member AS CM
          INNER JOIN tb_circle AS C ON CM.circleId = C.id
      WHERE
          CM.userId = ?
          AND CM.leftOn IS NULL
          AND C.inactivatedOn IS NULL`,
      [userId]
    )
      .then((result) => {
        if (result != null && result.length > 0) {
          return result.map((e) => {
            return { ...e };
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
   * Add a new Circle
   * @param name {string} Circle Name
   * @param createdBy {int} The user (id) who created the Circle
   * @return {int} Id of the new Circle
   */
  async add(name, createdBy, image) {
    return await query(
      `INSERT INTO tb_circle (name, createdBy, image) VALUES (?, ?, ?)`,
      [name, createdBy, image]
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
   * Set all Invited member with the same email to set the new user id
   * @param email {string} Email to use as a filter
   * @param userId {int} The user (id) to be set
   * @return void
   */
  async updateInviteWithUserIdByEmail(email, userId) {
    return await query(
      `UPDATE tb_circle_member SET userId = ? WHERE email = ? AND userId IS NULL AND joinedOn IS NULL AND leftOn IS NULL`,
      [userId, email]
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
   * Confirm a User (member) in a Circle
   * @param userId {int} The user Id
   * @param circleId {int} Circle Id
   * @return void
   */
  async confirmMemberOfCircle(userId, circleId) {
    return await query(
      `UPDATE tb_circle_member 
        SET 
          joinedOn = now()
        WHERE
          circleId = ?
          AND userId = ?
          AND joinedOn IS NULL
          AND leftOn IS NULL`,
      [circleId, userId]
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
   * Remove a User (member) from a Circle
   * @param userId {int} The user Id
   * @param circleId {int} Circle Id
   * @return void
   */
  async removeMemberFromCircle(userId, circleId) {
    return await query(
      `UPDATE tb_circle_member 
        SET 
          leftOn = now()
        WHERE
          circleId = ?
          AND userId = ?
          AND leftOn IS NULL`,
      [circleId, userId]
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
   * Get types of circle and which Plugin is a suggestion for it
   * @return {array} Types and Plugins
   */
  async getCircleTypesAndPluginSuggestions() {
    return await query(
      `SELECT 
          CTP.id
          , CT.id AS circleTypeId
          , CT.Name AS circleTypeNane
          , P.id AS pluginId
          , P.name AS pluginName
          , P.price AS pluginPrice
      FROM 
          tb_circle_type_plugin AS CTP 
          INNER JOIN tb_circle_type AS CT ON CTP.circleTypeId = CT.id
          INNER JOIN tb_plugin AS P ON CTP.pluginId = P.id
      WHERE 
          CTP.inactivatedOn IS NULL
          AND CT.inactivatedOn IS NULL
          AND P.inactivatedOn IS NULL`
    )
      .then((result) => {
        if (result != null && result.length > 0) {
          return result.map((e) => {
            return { ...e };
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
module.exports = Circle;
