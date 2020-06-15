/**
 * Business Logic related to the Tracking System Plugin
 *
 * @version 0.0.1
 * @author Eduardo Pereira do Carmo (https://github.com/eduardopcarmo)
 */

// Model
const TrackingSystem = require('../../models/plugin/trackingSystem');

// Custom Exception
const BvitError = require('../../core/express/bvitError');

/*
 * Business Logic related to the Tracking System Plugin
 */
class TrackingSystemService {
  constructor() {
    this.TrackingSystemModel = new TrackingSystem();
  }

  /*
   * Get users positions in a circle
   * @param circleId {int} Circle Id
   * @return {array} List of User Positions
   */
  async getUsersPosition(circleId) {
    return await this.TrackingSystemModel.getAllUsersInCircle(circleId)
      .then((userPositions) => {
        if (userPositions != null && userPositions.length > 0) {
          return userPositions;
        } else {
          throw new BvitError(
            404,
            'There are no current positions for users in this circle.'
          );
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Set user position
   * @param userId {int} User Id
   * @param latitude {decimal(11,8)} Latitude
   * @param longitude {decimal(11,8)} Longitude
   * @return {bool} Set or Not
   */
  async setUserPosition(userId, latitude, longitude) {
    // Check if already exists a position
    return await this.TrackingSystemModel.get(userId)
      .then(async (user) => {
        let success = true;

        // Insert
        if (!user) {
          const id = await this.TrackingSystemModel.add(
            userId,
            latitude,
            longitude
          );
          success = id > 0;
        } else {
          // Update
          success = await this.TrackingSystemModel.update(
            userId,
            latitude,
            longitude
          );
        }

        return success;
      })
      .then((success) => {
        if (success) {
          return true;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = TrackingSystemService;
