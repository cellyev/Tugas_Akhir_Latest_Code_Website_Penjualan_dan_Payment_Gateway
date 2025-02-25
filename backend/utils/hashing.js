const { hash, compare } = require("bcryptjs");

exports.doHash = (value, saltvalue) => {
  result = hash(value, saltvalue);
  return result;
};

exports.doHashValidation = (value, hashedValue) => {
  result = compare(value, hashedValue);
  return result;
};
