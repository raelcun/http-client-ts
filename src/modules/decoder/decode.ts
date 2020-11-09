import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold, left } from 'fp-ts/lib/Either'
import reporter from 'io-ts-reporters'
import { DecodedResult } from './types'

export const decode = <T>(type: t.Type<T, unknown>) => (value: unknown): DecodedResult<T> =>
  pipe(
    type.decode(value),
    fold(
      (err) => <DecodedResult<T>>{ errors: reporter.report(left(err)), typedValue: value as T },
      (typedValue) => <DecodedResult<T>>{ typedValue }
    )
  )
