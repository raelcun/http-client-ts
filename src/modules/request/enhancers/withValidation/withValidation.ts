import { RequestFn } from '../../core'
import { ValidationConfig } from './types'

export const withValidation = <T>(config: ValidationConfig<T>) => <U>(fn: RequestFn<U>): RequestFn<T> => (...params) =>
  fn(...params).then(async (response) => {
    const result = config.decoder(response.body)
    if (config.throwOnValidationFailure && result.errors !== undefined) {
      throw new Error(`validation failed [${result.errors.join(', ')}]`)
    }
    return { ...response, body: result.typedValue }
  })
