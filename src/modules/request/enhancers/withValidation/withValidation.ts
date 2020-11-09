import { RequestFn } from '../../core'
import { WrappedFn } from '../types'
import { TypedResponse, ValidationConfig } from './types'

const typeResponse = <T>(response: Response, body: T | undefined): TypedResponse<T> => ({
  headers: response.headers,
  redirected: response.redirected,
  status: response.status,
  statusText: response.statusText,
  type: response.type,
  ok: response.ok,
  url: response.url,
  body,
})

export const withValidation = <T>(config: ValidationConfig<T>): WrappedFn<RequestFn<U>, Promise<TypedResponse<T>>> => (
  fn
) => (...params) =>
  fn(...params).then(async (response: Response) => {
    let json: unknown
    try {
      json = await response.json()
    } catch {
      return typeResponse(response, undefined)
    }

    const result = config.decoder(json)
    if (config.throwOnValidationFailure && result.errors !== undefined) {
      throw new Error(`validation failed [${result.errors.join(', ')}]`)
    }
    return typeResponse(response, result.typedValue)
  })
