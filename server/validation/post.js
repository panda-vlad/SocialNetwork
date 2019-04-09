const Validator = require('validator');
const isEmpty = require ('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};


  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.password, {min: 6, max: 300})) {
    errors.text = 'Text field is required(6 min, max 300 )';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
}
