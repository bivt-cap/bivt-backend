// Database
const query = require('../../core/database');

/*
 * Tracking System
 */
class TrackingSystem {
  /*
   * Add a new user Position
   * @param userId {int} User Id
   * @param latitude {decimal(11,8)} Latitude
   * @param longitude {decimal(11,8)} Longitude
   * @return {int} Id of the new tracking position
   */
  async add(userId, latitude, longitude) {
    return await query(
      `INSERT INTO tb_plugin_tracking 
          (userId, latitude, longitude, lastUpdatedOn) 
        VALUES 
          (?, ?, ?, NOW())`,
      [userId, latitude, longitude]
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
   * Update an existing user Position
   * @param userId {int} User Id
   * @param latitude {decimal(11,8)} Latitude
   * @param longitude {decimal(11,8)} Longitude
   * @return void
   */
  async update(userId, latitude, longitude) {
    return await query(
      `UPDATE tb_plugin_tracking SET latitude = ?, longitude = ?, lastUpdatedOn = NOW() WHERE userId = ?`,
      [latitude, longitude, userId]
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
   * Get user current position
   * @param userId {int} User Id
   * @return {object} User Position
   */
  async get(userId) {
    return await query(
      `SELECT 
            U.id AS userId,
            U.extId AS userExtId,
            U.email,
            U.firstName AS userFirstName,
            U.lastName AS userLastName,
            U.photoUrl,
            PT.latitude,
            PT.longitude,
            PT.lastUpdatedOn
        FROM 
            tb_plugin_tracking AS PT
            INNER JOIN tb_user AS U ON PT.userId = U.id
        WHERE 
            PT.userId = ?
            AND U.emailValidatedOn IS NOT NULL`,
      [userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((position) => {
            return { ...position };
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
   * Get user current position of all users in a circle
   * @param circleId {int} Circle Id
   * @return {arry} Users Position
   */
  async getAllUsersInCircle(circleId) {
    return await query(
      `SELECT 
            U.id AS userId,
            U.extId AS userExtId,
            U.email,
            U.firstName AS userFirstName,
            U.lastName AS userLastName,
            U.photoUrl,
            PT.latitude,
            PT.longitude,
            PT.lastUpdatedOn
        FROM 
            tb_plugin_tracking AS PT
            INNER JOIN tb_user AS U ON PT.userId = U.id
            INNER JOIN tb_circle_member AS CM ON U.id = CM.userId
            INNER JOIN tb_circle AS C ON CM.circleId = C.id
        WHERE 
            C.id = ?           
            AND U.emailValidatedOn IS NOT NULL
            AND CM.joinedOn IS NOT NULL
            AND CM.leftOn IS NULL
            AND C.inactivatedOn IS NULL`,
      [circleId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((position) => {
            return { ...position };
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
module.exports = TrackingSystem;
