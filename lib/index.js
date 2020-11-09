"use strict";

var _crossFetch = _interopRequireDefault(require("cross-fetch"));

var _function = require("fp-ts/lib/function");

var t = _interopRequireWildcard(require("io-ts"));

var _request = require("./modules/request");

var _decoder = require("./modules/decoder");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fooV = t.type({
  foo: t.string
});
const client = (0, _function.flow)((0, _request.withValidation)({
  throwOnValidationFailure: false,
  decoder: (0, _decoder.decode)(fooV)
}))((0, _request.createRequest)(_crossFetch.default));
client({
  url: 'https://run.mocky.io/v3/308ed02a-4d22-47e1-bcc4-18043403a239'
}).then(results => console.log('invalid', results));
client({
  url: 'https://run.mocky.io/v3/c792533a-8309-47e8-8ee7-d27329090bce'
}).then(results => console.log('valid', results));