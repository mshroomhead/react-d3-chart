import { Dispatch, SetStateAction } from 'react';

type SetState<S> = Dispatch<SetStateAction<S>>;

export function createActions<A, S>(
  actions: (prevState: S, setState: SetState<S>) => A,
  setState: SetState<S>
): A {
  return Object.keys((actions as any)()).reduce(
    (mappedActions, key) => {
      (mappedActions as any)[key] = (...payload: any[]) =>
        setState(prevState =>
          (actions as any)(prevState, setState)[key](...payload)
        );
      return mappedActions;
    },
    {} as A
  );
}
