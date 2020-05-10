class BvitError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'BVIT_API_ERROR';
  }
}

module.exports = BvitError;
