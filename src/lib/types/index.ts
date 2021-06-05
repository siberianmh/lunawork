export type Awaited<T> = PromiseLike<T> | T

export interface IExperimentalOptions {
  readonly autoRegisterSlash: boolean
}
