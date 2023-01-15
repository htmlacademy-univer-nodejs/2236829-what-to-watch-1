import { RefType } from '@typegoose/typegoose/lib/types.js';

export type Populated<Type, Keys extends keyof NonNullable<Type> = keyof Type> = null extends Type
  ? Populated<NonNullable<Type>, Keys> | null
  : {
    [K in keyof Type]: K extends Keys
      ? Type[K] extends Array<unknown>
        ? Exclude<Type[K][number], RefType>[]
        : Exclude<Type[K], RefType>
      : Type[K]
  };
