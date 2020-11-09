import fetchMock from 'fetch-mock'
import { createRequest, FetchFn } from '../../core'
import { Decoder, ValidationConfig } from './types'
import { withValidation } from './withValidation'

const createSuccessfulDecoder = <T>(): Decoder<T> => (value: unknown) => ({ typedValue: value as T })
const createErrorDecoder = <T>(): Decoder<T> => (value: unknown) => ({
  errors: ['validation failed', 'and here is why'],
  typedValue: value as T,
})
const createClient = <T>(fetchFn: FetchFn, config: Partial<ValidationConfig<T>> = {}) =>
  withValidation({ throwOnValidationFailure: true, decoder: createSuccessfulDecoder(), ...config })(
    createRequest(fetchFn)
  )

describe('withValidation', () => {
  it.each<[Partial<ValidationConfig<unknown>>]>([
    [{ throwOnValidationFailure: true }],
    [{ throwOnValidationFailure: false }],
  ])(`should propagate requestFn failures when config is %j`, async (config) => {
    expect.assertions(1)

    const fetchMockInstance = fetchMock.sandbox().mock('foo', { throws: new Error('FAILED') })
    const client = createClient(fetchMockInstance)

    const resultP = client({ url: 'foo' })

    await expect(resultP).rejects.toThrowError('FAILED')
  })

  it.each<[Partial<ValidationConfig<unknown>>]>([[{ throwOnValidationFailure: false }]])(
    'should return typed body when validation fails and config is %j',
    async (config) => {
      expect.assertions(1)

      const response = { foo: 'bar' }
      const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
      const client = createClient(fetchMockInstance, { decoder: createErrorDecoder(), ...config })

      const result = await client({ url: 'foo' })

      await expect(result.body).toEqual(response)
    }
  )

  it.each<[Partial<ValidationConfig<unknown>>]>([
    [{ throwOnValidationFailure: true }],
    [{ throwOnValidationFailure: false }],
  ])('should return typed body when validation succeeds and config is %j', async (config) => {
    expect.assertions(1)

    const response = { foo: 'bar' }
    const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
    const client = createClient(fetchMockInstance, { decoder: createSuccessfulDecoder(), ...config })

    const result = await client({ url: 'foo' })

    await expect(result.body).toEqual(response)
  })

  it('should throw validation error when validation fails and throwOnValidationFailure is true', async () => {
    expect.assertions(1)

    const response = { foo: 'bar' }
    const fetchMockInstance = fetchMock.sandbox().mock('foo', response)
    const client = createClient(fetchMockInstance, { decoder: createErrorDecoder(), throwOnValidationFailure: true })

    const resultP = client({ url: 'foo' })

    await expect(resultP).rejects.toThrowError('validation failed [validation failed, and here is why]')
  })
})
