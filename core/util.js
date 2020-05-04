/*
 * Check if a string is a valid password
 */
const checkIfIsValidEmail = (password) => {
  // Password expresion that requires one lower case letter,
  // one upper case letter, one digit, 6-13 length, and no spaces.
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,13}$/gm)) {
    return Promise.reject(
      new Error(
        'Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces'
      )
    );
  }
  return true;
};

module.exports = { checkIfIsValidEmail };
