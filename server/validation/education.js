const Validator = require('validator');
const isEmpty = require ('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};


  data.schools = !isEmpty(data.schools) ? data.schools : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.title = 'school title field is required'
  }
  if (Validator.isEmpty(data.degree)) {
    errors.company = 'degree title field is required'
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'fieldofstudy title field is required'
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'from title field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
