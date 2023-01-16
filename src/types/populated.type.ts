import { DocumentType, Ref } from '@typegoose/typegoose/lib/types.js';

export type Populated<Type, Keys extends keyof NonNullable<Type> = keyof Type> = {
  [K in keyof Type]: K extends Keys
    ? Type[K] extends Array<unknown>
      ? Type[K][number] extends Ref<infer T> ? DocumentType<T>[] : Type[K]
      : Type[K] extends Ref<infer T> ? DocumentType<T> : Type[K]
    : Type[K]
};
