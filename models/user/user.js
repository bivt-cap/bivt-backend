/*
 * User
 */
class User {
  constructor(
    id,
    extId,
    email,
    password,
    firstName,
    lastName,
    isBlocked,
    emailValidationHash,
    emailValidatedAt
  ) {
    this.id = id;
    this.extId = extId;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isBlocked = isBlocked;
    this.emailValidationHash = emailValidationHash;
    this.emailValidatedAt = emailValidatedAt;
  }
}

// Export
module.exports = User;
