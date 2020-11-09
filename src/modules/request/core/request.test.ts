import { request } from './request'

describe('httpClient', () => {
  it('should invoke request with proper configuration', async () => {
    const mockFetch = jest.fn()
    await request({ url: 'foo', method: 'POST', requestFn: mockFetch })

    expect(mockFetch).toHaveBeenCalledWith('foo', { method: 'POST' })
  })

  it('should propagate errors', async () => {
    expect.assertions(1)

    const mockFetch = jest.fn().mockRejectedValue('ERROR')
    await request({ url: 'foo', method: 'POST', requestFn: mockFetch }).catch((err) => expect(err).toEqual('ERROR'))
  })
})
