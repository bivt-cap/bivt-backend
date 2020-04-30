/*
 * User
 */
class User {
  constructor(id, extId, email, password, firstName, lastName, isBlocked) {
    this.id = id;
    this.extId = extId;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isBlocked = isBlocked;
  }
}

// Export
module.exports = User;
