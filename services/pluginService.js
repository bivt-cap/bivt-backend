// Model
const Plugin = require('../models/plugin/plugin');
const Circle = require('../models/circle/circle');

// Custom Exception
const BvitError = require('../core/express/bvitError');

/*
 * Business Logic related to the User
 */
class PluginService {
  constructor() {
    this.PluginModel = new Plugin();
    this.CircleModel = new Circle();
  }

  /*
   * Get all active plugins
   * @return {array} List of active Plugins
   */
  async getAllActivePlugins() {
    return await this.PluginModel.getAllActive()
      .then((plugins) => {
        if (plugins != null && plugins.length > 0) {
          return plugins;
        } else {
          throw new BvitError(404, 'There are no active plugins.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all Plugins related to a Circle
   * @param circleId {int} Circle Id
   * @return {array} List of active Plugins ID
   */
  async getAllPluginsOnCircle(circleId, userId) {
    // Check if the user is a member of the circle
    return await this.CircleModel.getCirclesByUser(userId)
      .then((circles) => {
        // Check if the user has a circle
        if (circles != null && circles.length > 0) {
          // Find in the list of Circles if the user is an admin of the received circle id.
          const circle = circles.find((c) => {
            return c.id === circleId && c.isAdmin === 1;
          });

          // Found it ?
          if (circle !== undefined) {
            return circle;
          } else {
            throw new BvitError(401, 'Unauthorized');
          }
        } else {
          throw new BvitError(404, 'There are no circle related to this user.');
        }
      })
      .then(async (circle) => {
        return await this.PluginModel.getAllPluginsInCircle(circle.id);
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Add a Plugin to a Circle
   * @param id {int} Plugin Id
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {int} Id of the new PluginCircle
   */
  async addPluginToCircle(id, circleId, userId) {
    // Check if the user is a admin in the circle
    return await this.CircleModel.getCirclesByUser(userId)
      .then((circles) => {
        // Check if the user has a circle
        if (circles != null && circles.length > 0) {
          // Find in the list of Circles if the user is an admin of the received circle id.
          const circle = circles.find((c) => {
            return c.id === circleId && c.isAdmin === 1;
          });

          // Found it ?
          if (circle !== undefined) {
            return circle;
          } else {
            throw new BvitError(401, 'Unauthorized');
          }
        } else {
          throw new BvitError(404, 'There are no circle related to this user.');
        }
      })
      .then(async (selectedCircle) => {
        // Get all plugins in the circle and check if if the user is trying to add a new one
        const plugins = await this.PluginModel.getAllPluginsInCircle(
          selectedCircle.id
        );

        // check if the circle has a plugin
        if (plugins != null && plugins.length > 0) {
          const selectedPlugin = plugins.find((p) => {
            return p.id === id;
          });

          return selectedPlugin === undefined;
        } else {
          return true;
        }
      })
      .then(async (allowed) => {
        if (allowed) {
          return await this.PluginModel.addPluginToCircle(id, circleId, userId);
        } else {
          throw new BvitError(409, 'The plugin is already used in the Circle.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Remove a Plugin From a Circle
   * @param id {int} Plugin Id
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return void
   */
  async deletePluginToCircle(id, circleId, userId) {
    // Check if the user is a admin in the circle
    return await this.CircleModel.getCirclesByUser(userId)
      .then((circles) => {
        // Check if the user has a circle
        if (circles != null && circles.length > 0) {
          // Find in the list of Circles if the user is an admin of the received circle id.
          const circle = circles.find((c) => {
            return c.id === circleId && c.isAdmin === 1;
          });

          // Found it ?
          if (circle !== undefined) {
            return circle;
          } else {
            throw new BvitError(401, 'Unauthorized');
          }
        } else {
          throw new BvitError(404, 'There are no circle related to this user.');
        }
      })
      .then(async (selectedCircle) => {
        // Get all plugins in the circle and check if if the user is trying to add a new one
        const plugins = await this.PluginModel.getAllPluginsInCircle(
          selectedCircle.id
        );

        // check if the circle has a plugin
        if (plugins != null && plugins.length > 0) {
          const selectedPlugin = plugins.find((p) => {
            return p.id === id;
          });

          return selectedPlugin !== undefined;
        } else {
          return false;
        }
      })
      .then(async (exists) => {
        if (exists) {
          return await this.PluginModel.deletePluginToCircle(
            id,
            circleId,
            userId
          );
        } else {
          throw new BvitError(409, 'The plugin is not used in the Circle.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = PluginService;
