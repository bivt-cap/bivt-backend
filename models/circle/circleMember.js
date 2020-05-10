// Database
const query = require('../../core/database');

/*
 * Circle Member
 */
class CircleMember {
  /*
   * Add a new user to a Circle
   * @param circleId {int} Circle Id
   * @param createdBy {int} The user (id) who created the Circle
   * @param userId {int} Id of the user to be add in the circle (Can be null)
   * @param email {string} Email of the user to be add in the circle
   * @return {array} List of active members in a Circle
   */
  async add(circleId, createdBy, userId, email) {
    await query(
      `INSERT INTO tb_circle_member
              (circleId, userId, email, createdBy) 
          VALUES 
              (?, ?, ?, ?)`,
      [circleId, userId, email, createdBy]
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
   * Get all active (didn't leave) members in a Circle
   * @param circleId {int} Circle Id
   * @return {array} List of active members in a Circle
   */
  async getMemberOfACircle(circleId) {
    return await query(
      `SELECT 
            CM.id,
            CM.userId,
            CM.email,
            U.firstName AS userFirstName,
            U.lastName AS userLastName,
            CASE WHEN C.createdBy = CM.userId THEN 1 ELSE 0 END AS isOwner,
            CASE WHEN CM.setAsAdminAt IS NOT NULL THEN 1 ELSE 0 END AS isAdmin,
            CM.joinedAt
        FROM
            tb_circle_member CM
            INNER JOIN tb_circle C ON CM.circleId = c.id
            LEFT JOIN tb_user U ON CM.userId = U.id 
        WHERE
            CM.circleId = ?
            AND C.inactiveAt = 1
            AND CM.leftAt IS NULL`,
      [circleId]
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
}

// Export
module.exports = CircleMember;
