export function injectPrevState<A, S>(
  actionFunction: (prevState?: S) => A,
  setState: (setState: (prevState: S) => S) => void
): A {
  return Object.keys(actionFunction()).reduce(
    (actions, key) => {
      (actions as any)[key] = (...payload: any[]) =>
        setState(prevState =>
          (actionFunction as any)(prevState)[key](...payload)
        );
      return actions;
    },
    {} as A
  );
}
