"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withValidation = void 0;

const withValidation = config => fn => (...params) => fn(...params).then(async response => {
  const result = config.decoder(response.body);

  if (config.throwOnValidationFailure && result.errors !== undefined) {
    throw new Error(`validation failed [${result.errors.join(', ')}]`);
  }

  return { ...response,
    body: result.typedValue
  };
});

exports.withValidation = withValidation;