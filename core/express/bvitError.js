class BvitError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = BvitError;
