import fetch from 'cross-fetch'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'
import { decode } from './modules/decoder/decode'
import { request } from './modules/request/core'
import { withValidation } from './modules/request/enhancers/withValidation'

const fooV = t.type({ foo: t.number })

const validatedRequest = pipe(withValidation({ throwOnValidationFailure: false, decoder: decode(fooV) }))(request)

validatedRequest({
  url: 'https://run.mocky.io/v3/c792533a-8309-47e8-8ee7-d27329090bce',
  method: 'GET',
  requestFn: fetch,
})
  .then((result) => {
    console.log(result.status, result.statusText, result.body)
  })
  .catch((err) => console.error(err))
