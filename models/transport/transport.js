// Models
const TransportStatus = require('./transportStatus');

/*
 * Transportation
 */
class Transport {
  constructor(statusId, errors, data) {
    // Set the status Id
    this.status = new TransportStatus(statusId);
    // Check if the erros is a array
    if (errors != null) {
      if (Array.isArray(errors)) {
        this.status.errors = errors;
      } else {
        this.status.errors = [errors];
      }
    } else {
      this.status.errors = null;
    }
    // return the data
    this.data = data;
  }
}

module.exports = Transport;
