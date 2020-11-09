import fetchMock from 'fetch-mock'
import { createRequest } from './request'

describe('httpClient', () => {
  it('should invoke request with proper configuration', async () => {
    const fetchMockInstance = fetchMock.sandbox().post('foo', {})
    await createRequest(fetchMockInstance)({ url: 'foo', method: 'POST' })

    expect(fetchMockInstance.calls()).toMatchInlineSnapshot(`
      Array [
        Array [
          "/foo",
          Object {
            "method": "POST",
          },
        ],
      ]
    `)
  })

  it('should propagate fetch errors', async () => {
    expect.assertions(1)

    const mockFetch = jest.fn().mockRejectedValue('ERROR')
    await createRequest(mockFetch)({ url: 'foo', method: 'POST' }).catch((err) => expect(err).toEqual('ERROR'))
  })

  it('should return undefined body for non-json response', async () => {
    expect.assertions(1)

    const fetchMockInstance = fetchMock.sandbox().mock('foo', 'this is not json')
    const client = createRequest(fetchMockInstance)

    const result = await client({ url: 'foo' })

    await expect(result.body).toEqual(undefined)
  })

  it('should propagate requestFn response values', async () => {
    expect.assertions(1)

    const response = { foo: 'bar' }
    const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
    const client = createRequest(fetchMockInstance)

    const result = await client({ url: 'foo' })
    const actualResult = await fetchMockInstance('foo')

    await expect(result).toEqual(
      expect.objectContaining({
        headers: actualResult.headers,
        redirected: actualResult.redirected,
        status: actualResult.status,
        statusText: actualResult.statusText,
        type: actualResult.type,
        ok: actualResult.ok,
        url: actualResult.url,
      })
    )
  })
})
