import { RequestFn } from './types'

export const request: RequestFn = (config) => {
  const { requestFn, url, ...requestConfig } = config
  return requestFn(url, requestConfig)
}
