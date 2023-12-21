import * as t from 'io-ts'

const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i


export interface UUIDBrand {
  readonly UUID: unique symbol
}

export type UUID = t.Branded<string, UUIDBrand>

export const UUID = t.brand(t.string, (s): s is UUID => regex.test(s), 'UUID')