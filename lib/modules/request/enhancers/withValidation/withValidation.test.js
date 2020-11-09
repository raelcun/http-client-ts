"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _core = require("../../core");

var _withValidation = require("./withValidation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSuccessfulDecoder = () => value => ({
  typedValue: value
});

const createErrorDecoder = () => value => ({
  errors: ['validation failed', 'and here is why'],
  typedValue: value
});

const createClient = (fetchFn, config = {}) => (0, _withValidation.withValidation)({
  throwOnValidationFailure: true,
  decoder: createSuccessfulDecoder(),
  ...config
})((0, _core.createRequest)(fetchFn));

describe('withValidation', () => {
  it.each([[{
    throwOnValidationFailure: true
  }], [{
    throwOnValidationFailure: false
  }]])(`should propagate requestFn failures when config is %j`, async config => {
    expect.assertions(1);

    const fetchMockInstance = _fetchMock.default.sandbox().mock('foo', {
      throws: new Error('FAILED')
    });

    const client = createClient(fetchMockInstance);
    const resultP = client({
      url: 'foo'
    });
    await expect(resultP).rejects.toThrowError('FAILED');
  });
  it.each([[{
    throwOnValidationFailure: false
  }]])('should return typed body when validation fails and config is %j', async config => {
    expect.assertions(1);
    const response = {
      foo: 'bar'
    };

    const fetchMockInstance = _fetchMock.default.sandbox().mock('foo', response);

    const client = createClient(fetchMockInstance, {
      decoder: createErrorDecoder(),
      ...config
    });
    const result = await client({
      url: 'foo'
    });
    await expect(result.body).toEqual(response);
  });
  it.each([[{
    throwOnValidationFailure: true
  }], [{
    throwOnValidationFailure: false
  }]])('should return typed body when validation succeeds and config is %j', async config => {
    expect.assertions(1);
    const response = {
      foo: 'bar'
    };

    const fetchMockInstance = _fetchMock.default.sandbox().mock('foo', response);

    const client = createClient(fetchMockInstance, {
      decoder: createSuccessfulDecoder(),
      ...config
    });
    const result = await client({
      url: 'foo'
    });
    await expect(result.body).toEqual(response);
  });
  it('should throw validation error when validation fails and throwOnValidationFailure is true', async () => {
    expect.assertions(1);
    const response = {
      foo: 'bar'
    };

    const fetchMockInstance = _fetchMock.default.sandbox().mock('foo', response);

    const client = createClient(fetchMockInstance, {
      decoder: createErrorDecoder(),
      throwOnValidationFailure: true
    });
    const resultP = client({
      url: 'foo'
    });
    await expect(resultP).rejects.toThrowError('validation failed [validation failed, and here is why]');
  });
});