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
          CASE WHEN CM.setAsAdminOn IS NOT NULL THEN 1 ELSE 0 END AS isAdmin
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
  async add(name, createdBy) {
    return await query(
      `INSERT INTO tb_circle (name, createdBy) VALUES (?, ?)`,
      [name, createdBy]
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
}

// Export
module.exports = Circle;
