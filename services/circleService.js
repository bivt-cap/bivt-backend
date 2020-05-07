// Database
const query = require('../core/database');

/*
 * Business Logic related to the User
 */
class CircleService {
  /*
   * Get the number of Circles that the user is owner
   * @param userId {id} User Id
   * @return {int} Number of Circles that the user is owner
   */
  async getNumberCirclesByOwner(userId) {
    return await query(
      `SELECT COUNT(id) AS total FROM tb_circle WHERE createdBy = ? AND active = 1`,
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
   * Create a new Circles
   * @param ownerId {id} User (Owner) Id
   * @param ownerEmail {string} User (owner) Email
   * @param name {string} Name of the new Circle
   * @return {int} id of the new Circle
   */
  async addNewCircle(ownerId, ownerEmail, name) {
    return await query(
      `INSERT INTO tb_circle (name, createdBy) VALUES (?, ?)`,
      [name, ownerId]
    )
      .then((result) => {
        // Check if has result
        if (result != null) {
          return parseInt(result.insertId, 10);
        } else {
          throw new Error('An error occurred, please try again later.');
        }
      })
      .then(async (circleId) => {
        await query(
          `INSERT INTO tb_circle_member
                (circleId, userId, email, createdBy, joinedAt) 
            VALUES 
                (?, ?, ?, ?, NOW())`,
          [circleId, ownerId, ownerEmail, ownerId]
        );
        return circleId;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Return the list of all Circles that the user belongs (invited or owner)
   * @param userId {id} User Id
   * @return List of Circles
   */
  async GetCircleByUser(userId) {
    return await query(
      `SELECT 
          C.id,
          C.name,
          CASE WHEN C.createdBy = CM.userId THEN 1 ELSE 0 END AS isOwner,
          CM.joinedAt
      FROM 
        tb_circle_member AS CM
          INNER JOIN tb_circle AS C ON CM.circleId = C.id
      WHERE
        CM.userId = ?
          AND CM.leftAt IS NULL
          AND C.active = 1`,
      [userId]
    ).then((result) => {
      if (result != null && result.length > 0) {
        return result.map((e) => {
          return {
            id: e.id,
            name: e.name,
            isOwner: e.isOwner,
            joinedAt: e.joinedAt,
          };
        });
      } else {
        return null;
      }
    });
  }
}

// Export the service class
module.exports = CircleService;
