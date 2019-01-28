import { createContext, default as React, ReactNode, useReducer } from 'react';
import { DomainLinear, DomainTime } from '../../d3Chart/models';
import { Datum } from '../Demo';
import { Loadable } from '../models';

interface ChartState {
  xDomain: DomainTime | undefined;
  yDomain: DomainLinear | undefined;
  animate: boolean;
  color: string;
  data: Loadable<Datum[]>;
}

const initialChartState: ChartState = {
  xDomain: undefined,
  yDomain: [100, 200],
  animate: false,
  color: '#0088cc',
  data: Loadable.Empty(),
};

interface Action {
  action: keyof ReturnType<typeof chartActions>;
  payload: any[];
  actions?: any;
}

const reducer = (prevState: ChartState, action: Action) =>
  (chartActions(prevState, action.actions) as any)[action.action](
    ...action.payload
  );

const chartActions = (
  prevState: ChartState = initialChartState,
  actions?: any
) => ({
  setData(data: Loadable<Datum[]>): ChartState {
    return { ...prevState, data };
  },

  loadData(): ChartState {
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart')
      .then(res => res.json())
      .then(data => {
        actions.setData(Loadable.Valid(data));
      })
      .catch(() => {
        actions.setData(Loadable.Failed());
      });

    return { ...prevState, data: Loadable.Loading() };
  },

  changeXDomain(domain: DomainTime, animate: boolean = false): ChartState {
    return { ...prevState, xDomain: domain, animate };
  },

  toggleColor(): ChartState {
    return {
      ...prevState,
      color: prevState.color === '#ef5b5b' ? '#0088cc' : '#ef5b5b',
    };
  },
});

type Actions = ReturnType<typeof chartActions>;

const createActions = (dispatch: (action: Action) => void) => {
  return Object.keys(chartActions()).reduce(
    (actions, key) => {
      (actions as any)[key as keyof Actions] = (...args: any[]) =>
        dispatch({
          action: key as keyof Actions,
          payload: args,
          actions: actions,
        });
      return actions;
    },
    {} as Actions
  );
};

export const ChartContext = createContext({
  state: {} as ChartState,
  actions: {} as ReturnType<typeof createActions>,
});

export function ChartContextProvider(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialChartState);

  const actions = createActions(dispatch);

  return (
    <ChartContext.Provider value={{ state, actions }}>
      {props.children}
    </ChartContext.Provider>
  );
}
