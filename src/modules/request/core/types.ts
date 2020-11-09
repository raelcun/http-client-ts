export type RequestConfig = RequestInit & {
  url: string
  requestFn: (url: string, init: RequestInit) => Promise<Response>
}
export type RequestFn<T = Response> = (config: RequestConfig) => Promise<T>
