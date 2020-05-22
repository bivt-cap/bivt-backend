// Model
const Plugin = require('../models/plugin/plugin');

// Custom Exception
const BvitError = require('../core/express/bvitError');

/*
 * Business Logic related to the User
 */
class PluginService {
  constructor() {
    this.PluginModel = new Plugin();
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
}

// Export the service class
module.exports = PluginService;
