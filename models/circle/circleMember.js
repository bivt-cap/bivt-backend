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
          CM.userId AS id,
          U.extId,
          CM.email,
          U.firstName AS userFirstName,
          U.lastName AS userLastName,
          U.photoUrl,
          CASE WHEN C.createdBy = CM.userId THEN 1 ELSE 0 END AS isOwner,
          CM.joinedOn,
          CASE WHEN CM.setAsAdminOn IS NOT NULL THEN 1 ELSE 0 END AS isAdmin
      FROM
          tb_circle_member CM
          INNER JOIN tb_circle C ON CM.circleId = C.id
          LEFT JOIN tb_user U ON CM.userId = U.id 
      WHERE
          CM.circleId = ?
          AND C.inactivatedOn IS NULL
          AND CM.leftOn IS NULL`,
      [circleId]
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
}

// Export
module.exports = CircleMember;
