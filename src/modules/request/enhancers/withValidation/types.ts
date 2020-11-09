export type ValidationConfig<T> = { throwOnValidationFailure: boolean; decoder: Decoder<T> }
export type TypedResponse<T> = Pick<
  Response,
  'headers' | 'redirected' | 'status' | 'type' | 'url' | 'statusText' | 'ok'
> & {
  body?: T
}
export type Decoder<T> = (value: unknown) => { errors?: string[]; typedValue: T }
