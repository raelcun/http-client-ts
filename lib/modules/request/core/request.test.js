"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _request = require("./request");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('httpClient', () => {
  it('should invoke request with proper configuration', async () => {
    const fetchMockInstance = _fetchMock.default.sandbox().post('foo', {});

    await (0, _request.createRequest)(fetchMockInstance)({
      url: 'foo',
      method: 'POST'
    });
    expect(fetchMockInstance.calls()).toMatchInlineSnapshot(`
      Array [
        Array [
          "/foo",
          Object {
            "method": "POST",
          },
        ],
      ]
    `);
  });
  it('should propagate fetch errors', async () => {
    expect.assertions(1);
    const mockFetch = jest.fn().mockRejectedValue('ERROR');
    await (0, _request.createRequest)(mockFetch)({
      url: 'foo',
      method: 'POST'
    }).catch(err => expect(err).toEqual('ERROR'));
  });
  it('should return undefined body for non-json response', async () => {
    expect.assertions(1);

    const fetchMockInstance = _fetchMock.default.sandbox().mock('foo', 'this is not json');

    const client = (0, _request.createRequest)(fetchMockInstance);
    const result = await client({
      url: 'foo'
    });
    await expect(result.body).toEqual(undefined);
  });
  it('should propagate requestFn response values', async () => {
    expect.assertions(1);
    const response = {
      foo: 'bar'
    };

    const fetchMockInstance = _fetchMock.default.sandbox().mock('foo', response);

    const client = (0, _request.createRequest)(fetchMockInstance);
    const result = await client({
      url: 'foo'
    });
    const actualResult = await fetchMockInstance('foo');
    await expect(result).toEqual(expect.objectContaining({
      headers: actualResult.headers,
      redirected: actualResult.redirected,
      status: actualResult.status,
      statusText: actualResult.statusText,
      type: actualResult.type,
      ok: actualResult.ok,
      url: actualResult.url
    }));
  });
});