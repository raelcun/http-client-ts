"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = void 0;

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _ioTsReporters = _interopRequireDefault(require("io-ts-reporters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const decode = type => value => (0, _pipeable.pipe)(type.decode(value), (0, _Either.fold)(err => ({
  errors: _ioTsReporters.default.report((0, _Either.left)(err)),
  typedValue: value
}), typedValue => ({
  typedValue
})));

exports.decode = decode;