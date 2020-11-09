import { BaseRequestConfig, FetchFn, RequestFn, TypedResponse } from './types'

const pluckResponseFields = <T>(response: TypedResponse<unknown>, body: T | undefined): TypedResponse<T> => ({
  headers: response.headers,
  redirected: response.redirected,
  status: response.status,
  statusText: response.statusText,
  type: response.type,
  ok: response.ok,
  url: response.url,
  body,
})

export const createRequest = (fetchFn: FetchFn): RequestFn<unknown> => async (config: BaseRequestConfig) => {
  const { url, ...requestConfig } = config
  const result = await fetchFn(url, requestConfig)

  try {
    return pluckResponseFields(result, await result.json())
  } catch {
    return pluckResponseFields(result, undefined)
  }
}
