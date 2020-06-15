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
 * Check if a string is a valid datetime
 */
const checkIfIsValidDatetime = (datetime) => {
  // yyyy-MM-dd HH:MM:SS
  if (!datetime.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)) {
    return Promise.reject(
      new Error('Datetime is not a valid datetime format (yyyy-MM-dd HH:MM:SS)')
    );
  }
  return true;
};

/*
 * Check if a string is a valid Latitude
 */
const checkIfIsValidLatitude = (latitude) => {
  // decimal(11,8)
  if (!latitude.toString().match(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,8}/)) {
    return Promise.reject(new Error('Latitude is not valid'));
  }
  return true;
};

/*
 * Check if a string is a valid Longitude
 */
const checkIfIsValidLongitude = (longitude) => {
  // decimal(11,8)
  if (
    !longitude
      .toString()
      .match(/^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,8}/)
  ) {
    return Promise.reject(new Error('Longitude is not valid'));
  }
  return true;
};

/*
 * Check if an user belongs to a circle
 */
const checkIfUserBelongsCircle = (circleId, user) => {
  // Check if the user belongs to a circle
  if (
    Array.isArray(user.circles) &&
    user.circles.includes(parseInt(circleId))
  ) {
    return true;
  } else {
    throw new Error('Unauthorized');
  }
};

module.exports = {
  checkIfIsValidPassword,
  checkIfIsValidDatetime,
  checkIfIsValidLatitude,
  checkIfIsValidLongitude,
  checkIfUserBelongsCircle,
};
