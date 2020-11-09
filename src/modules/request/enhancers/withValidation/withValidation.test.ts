import fetchMock from 'fetch-mock'
import { request } from '../../core'
import { Decoder, ValidationConfig } from './types'
import { withValidation } from './withValidation'

const createSuccessfulDecoder = <T>(): Decoder<T> => (value: unknown) => ({ typedValue: value as T })
const createErrorDecoder = <T>(): Decoder<T> => (value: unknown) => ({
  errors: ['validation failed', 'and here is why'],
  typedValue: value as T,
})
const createClient = <T>(config: Partial<ValidationConfig<T>> = {}) =>
  withValidation({ throwOnValidationFailure: true, decoder: createSuccessfulDecoder(), ...config })(request)

describe('withValidation', () => {
  it.each<[Partial<ValidationConfig<unknown>>]>([
    [{ throwOnValidationFailure: true }],
    [{ throwOnValidationFailure: false }],
  ])(`should propagate requestFn failures when config is %j`, async (config) => {
    expect.assertions(1)

    const fetchMockInstance = fetchMock.sandbox().mock('foo', { throws: new Error('FAILED') })
    const client = createClient(config)

    const resultP = client({ url: 'foo', requestFn: fetchMockInstance })

    await expect(resultP).rejects.toThrowError('FAILED')
  })

  it('should return undefined body for non-json response', async () => {
    expect.assertions(1)

    const fetchMockInstance = fetchMock.sandbox().mock('foo', 'this is not json')
    const client = createClient()

    const result = await client({ url: 'foo', requestFn: fetchMockInstance })

    await expect(result.body).toEqual(undefined)
  })

  it.each<[Partial<ValidationConfig<unknown>>]>([[{ throwOnValidationFailure: false }]])(
    'should return typed body when validation fails and config is %j',
    async (config) => {
      expect.assertions(1)

      const response = { foo: 'bar' }
      const decoder = createErrorDecoder()
      const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
      const client = createClient({ decoder, ...config })

      const result = await client({ url: 'foo', requestFn: fetchMockInstance })

      await expect(result.body).toEqual(response)
    }
  )

  it.each<[Partial<ValidationConfig<unknown>>]>([
    [{ throwOnValidationFailure: true }],
    [{ throwOnValidationFailure: false }],
  ])('should return typed body when validation succeeds and config is %j', async (config) => {
    expect.assertions(1)

    const response = { foo: 'bar' }
    const decoder = createSuccessfulDecoder()
    const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
    const client = createClient({ decoder, ...config })

    const result = await client({ url: 'foo', requestFn: fetchMockInstance })

    await expect(result.body).toEqual(response)
  })

  it('should throw validation error when validation fails and throwOnValidationFailure is true', async () => {
    expect.assertions(1)

    const response = { foo: 'bar' }
    const decoder = createErrorDecoder()
    const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
    const client = createClient({ decoder, throwOnValidationFailure: true })

    const resultP = client({ url: 'foo', requestFn: fetchMockInstance })

    await expect(resultP).rejects.toThrowError('validation failed [validation failed, and here is why]')
  })

  it('should propagate requestFn response values', async () => {
    expect.assertions(1)

    const response = { foo: 'bar' }
    const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
    const client = createClient()

    const result = await client({ url: 'foo', requestFn: fetchMockInstance })
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
