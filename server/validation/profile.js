const Validator = require('validator');
const isEmpty = require ('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};


  data.handle = !isEmpty(data.handle) ? data.email : '';
  data.status = !isEmpty(data.status) ? data.password : '';
  data.skills = !isEmpty(data.skills) ? data.password : '';

  if(!Validator.isLength(data.handle, {min:2, max:30})) {
    errors.handle = 'handle must be min 2 max 30';
  }

  if(!Validator.isLength(data.status)) {
    errors.status = 'Status';
  }

  if(!Validator.isLength(data.skills)) {
    errors.skills = 'skiils';
  }

  if(!isEmpty(data.youtube)) {
    if(!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.twitter)) {
    if(!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.facebook)) {
    if(!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
