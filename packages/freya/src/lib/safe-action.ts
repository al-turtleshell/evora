
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from "fp-ts/lib/function";
import * as t from 'io-ts';
import { Miscue, MiscueCode, decode } from '@turtleshell/daedelium';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { Either } from 'fp-ts/lib/Either';





const authContext = (): TE.TaskEither<Miscue, Session> => {
  return pipe(
    TE.tryCatch(
      async () => {
        const session = await getServerSession(options)

        if (!session) {
          throw new Error('You need to be logged in to perform this action')
        }
        
        return session;
      },
      () => {
        return Miscue.create({
          code: MiscueCode.AUTH_SESSION_NOT_FOUND_ERROR,
          message: 'You need to be logged in to perform this action',
          timestamp: Date.now()
        })
      }),
      TE.map((session) => session)
    )
}

export const safeAction = <T>() => <B extends TE.TaskEither<Miscue, T>, C extends t.Mixed>(
  schema: C,
  fn: (data: t.TypeOf<C>, context: Session) => B
) => async (values: unknown): Promise<Either<Miscue, T>>  => {
  return await pipe(
      TE.bindTo('context')(authContext()),
      TE.bind('data',   ()                  => TE.fromEither(decode(schema, values))),
      TE.bind('result', ({ data, context }) => fn(data, context)),
      TE.map(           ({ result })        => result)
  )()
}

