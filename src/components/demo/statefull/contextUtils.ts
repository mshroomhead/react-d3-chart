export function injectPrevState<A, S>(
  actionFunction: (...args: any[]) => A,
  setState: (setState: (prevState: S) => S) => void
): A {
  return Object.keys(actionFunction()).reduce(
    (actions, key) => {
      (actions as any)[key] = (...payload: any[]) =>
        setState(prevState =>
          (actionFunction as any)(setState, prevState)[key](...payload)
        );
      return actions;
    },
    {} as A
  );
}
