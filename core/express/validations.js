/*
 * Check if a string is a valid password
 */
const checkIfIsValidPassword = (password) => {
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

/*
 * Check if an user belongs to a circle
 */
const checkIfUserBelongsCircle = (circleId, user) => {
  // Check if the user belongs to a circle
  if (Array.isArray(user.circles) && user.circles.includes(circleId)) {
    return true;
  } else {
    throw new Error('Unauthorized');
  }
};

module.exports = { checkIfIsValidPassword, checkIfUserBelongsCircle };
