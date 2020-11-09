import fetch from 'cross-fetch'
import { flow } from 'fp-ts/lib/function'
import * as t from 'io-ts'
import { createRequest, withValidation } from './modules/request'
import { decode } from './modules/decoder'

const fooV = t.type({ foo: t.string })
const client = flow(withValidation({ throwOnValidationFailure: false, decoder: decode(fooV) }))(createRequest(fetch))

client({ url: 'https://run.mocky.io/v3/308ed02a-4d22-47e1-bcc4-18043403a239' }).then((results) =>
  console.log('invalid', results)
)

client({ url: 'https://run.mocky.io/v3/c792533a-8309-47e8-8ee7-d27329090bce' }).then((results) =>
  console.log('valid', results)
)
