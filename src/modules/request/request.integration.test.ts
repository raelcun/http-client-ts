import { pipe } from 'fp-ts/lib/pipeable'
import { request } from './core'
import { Decoder, withValidation } from './enhancers'

const createSuccessfulDecoder = <T>(): Decoder<T> => (value: unknown) => ({ typedValue: value as T })

describe('request - integration', () => {
  it('should be able to compose enhancers', async () => {
    const requestWithValidation = withValidation({
      throwOnValidationFailure: false,
      decoder: createSuccessfulDecoder(),
    })
    const requestWithDoubleValidation = withValidation({
      throwOnValidationFailure: false,
      decoder: createSuccessfulDecoder(),
    })
    const requestWithTripleValidation = withValidation({
      throwOnValidationFailure: false,
      decoder: createSuccessfulDecoder(),
    })
    const a = requestWithDoubleValidation(requestWithValidation)

    const foo = pipe(
      withValidation({
        throwOnValidationFailure: false,
        decoder: createSuccessfulDecoder(),
      }),
      withValidation({
        throwOnValidationFailure: false,
        decoder: createSuccessfulDecoder(),
      })
    )
  })
})
