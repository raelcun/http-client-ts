export type TypedResponse<T> = Pick<
  Response,
  'headers' | 'redirected' | 'status' | 'type' | 'url' | 'statusText' | 'ok'
> & {
  body?: T
}
export type BaseRequestConfig = RequestInit & { url: string }
export type RequestFn<T> = (config: BaseRequestConfig) => Promise<TypedResponse<T>>
export type FetchFn = (
  url: string,
  config?: RequestInit
) => Promise<TypedResponse<unknown> & { json: () => Promise<unknown> }>
