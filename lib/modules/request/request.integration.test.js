// import fetch from 'cross-fetch'
// import { flow } from 'fp-ts/lib/function'
// import * as t from 'io-ts'
// export type TypedResponse<T> = Pick<
//   Response,
//   'headers' | 'redirected' | 'status' | 'type' | 'url' | 'statusText' | 'ok'
// > & {
//   body?: T
// }
// type BaseRequestConfig = RequestInit & { url: string }
// type RequestFn<T> = (config: BaseRequestConfig) => Promise<TypedResponse<T>>
// type FetchFn = (url: string, config?: RequestInit) => Promise<Response>
// const typeResponse = <T>(response: Response, body: T | undefined): TypedResponse<T> => ({
//   headers: response.headers,
//   redirected: response.redirected,
//   status: response.status,
//   statusText: response.statusText,
//   type: response.type,
//   ok: response.ok,
//   url: response.url,
//   body,
// })
// const baseRequestFn = (fetchFn: FetchFn): RequestFn<unknown> => async (config: BaseRequestConfig) => {
//   const { url, ...requestConfig } = config
//   const result = await fetchFn(url, requestConfig)
//   try {
//     return typeResponse(result, result.json())
//   } catch {
//     return typeResponse(result, undefined)
//   }
// }
// const withValidation = <T>(validator: t.Type<T, unknown>) => <U>(fn: RequestFn<U>): RequestFn<T> =>
//   ({ validator, fn } as any)
// const validation1 = withValidation(t.string)
// const validation2 = withValidation(t.string)
// const a = flow(baseRequestFn, validation1, validation2)(fetch)
// // describe('request - integration', () => {
// //   it('should be able to compose enhancers', async () => {
// //     const requestWithValidation = withValidation({
// //       throwOnValidationFailure: false,
// //       decoder: createSuccessfulDecoder(),
// //     })
// //     const requestWithDoubleValidation = withValidation({
// //       throwOnValidationFailure: false,
// //       decoder: createSuccessfulDecoder(),
// //     })
// //     const requestWithTripleValidation = withValidation({
// //       throwOnValidationFailure: false,
// //       decoder: createSuccessfulDecoder(),
// //     })
// //     const a = requestWithDoubleValidation(requestWithValidation)
// //     const foo = pipe(
// //       withValidation({
// //         throwOnValidationFailure: false,
// //         decoder: createSuccessfulDecoder(),
// //       }),
// //       withValidation({
// //         throwOnValidationFailure: false,
// //         decoder: createSuccessfulDecoder(),
// //       })
// //     )
// //   })
// // })
"use strict";