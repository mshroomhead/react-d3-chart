enum LoadableState {
  IsEmpty = 'IsEmpty',
  IsLoading = 'IsLoading',
  IsValid = 'IsValid',
  IsFailed = 'IsFailed',
}

export class Loadable<V, E = any> {
  readonly value: V = undefined as any;
  readonly error: E = undefined as any;

  static Empty<V, E = any>() {
    return new Loadable<V, E>(LoadableState.IsEmpty);
  }

  static Loading<V, E = any>(oldValue?: V) {
    return new Loadable<V, E>(LoadableState.IsLoading, oldValue);
  }

  static Valid<V, E = any>(value: V) {
    return new Loadable<V, E>(LoadableState.IsValid, value);
  }

  static Failed<E, V = any>(error?: E) {
    return new Loadable<V, E>(LoadableState.IsFailed, error);
  }

  get isEmpty() {
    return this.state === LoadableState.IsEmpty;
  }

  get isLoading() {
    return this.state === LoadableState.IsLoading;
  }

  get isValid() {
    return this.state === LoadableState.IsValid;
  }

  get isFailed() {
    return this.state === LoadableState.IsFailed;
  }

  private constructor(public readonly state: LoadableState, payload?: V | E) {
    if (
      this.state === LoadableState.IsValid ||
      this.state === LoadableState.IsLoading
    ) {
      this.value = payload as V;
    }

    if (this.state === LoadableState.IsFailed) {
      this.error = payload as E;
    }
  }
}
