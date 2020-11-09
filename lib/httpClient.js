"use strict";

var _crossFetch = _interopRequireDefault(require("cross-fetch"));

var _pipeable = require("fp-ts/lib/pipeable");

var t = _interopRequireWildcard(require("io-ts"));

var _decode = require("./modules/decoder/decode");

var _core = require("./modules/request/core");

var _withValidation = require("./modules/request/enhancers/withValidation");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fooV = t.type({
  foo: t.number
});
const validatedRequest = (0, _pipeable.pipe)((0, _withValidation.withValidation)({
  throwOnValidationFailure: false,
  decoder: (0, _decode.decode)(fooV)
}))(_core.request);
validatedRequest({
  url: 'https://run.mocky.io/v3/c792533a-8309-47e8-8ee7-d27329090bce',
  method: 'GET',
  requestFn: _crossFetch.default
}).then(result => {
  console.log(result.status, result.statusText, result.body);
}).catch(err => console.error(err));