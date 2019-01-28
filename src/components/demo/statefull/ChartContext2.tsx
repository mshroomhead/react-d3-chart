import {
  createContext,
  default as React,
  ReactNode,
  useReducer,
  useState,
} from 'react';
import { DomainLinear, DomainTime } from '../../d3Chart/models';
import { Datum } from '../Demo';
import { Loadable } from '../models';
import { injectPrevState } from './contextUtils';

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
}

const reducer = (prevState: ChartState, action: Action) =>
  (chartActions(prevState) as any)[action.action](...action.payload);

const chartActions = (
  prevState: ChartState = initialChartState,
  dispatch: (...args: any[]) => void = () => null
) => ({
  setData(data: Loadable<Datum[]>): ChartState {
    return { ...prevState, data };
  },

  loadData(): ChartState {
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart')
      .then(res => res.json())
      .then(data => {
        dispatch(this.setData(Loadable.Valid(data)));
      })
      .catch(() => {
        dispatch(this.setData(Loadable.Failed()));
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

const createActions2 = (dispatch: (action: Action) => void) => {
  return Object.keys(chartActions()).reduce(
    (actions, key) => {
      actions[key as keyof Actions] = (...args: any[]) =>
        dispatch({ action: key as keyof Actions, payload: args });
      return actions;
    },
    {} as ReturnType<typeof createActions>
  );
};

const createActions = (dispatch: (action: Action) => void) => ({
  setData: (data: Loadable<Datum[]>) =>
    dispatch({ action: 'setData', payload: [data] }),
  loadData: () => dispatch({ action: 'loadData', payload: [] }),
  changeXDomain: (domain: DomainTime, animate: boolean = false) =>
    dispatch({ action: 'changeXDomain', payload: [] }),
  toggleColor: () => dispatch({ action: 'toggleColor', payload: [] }),
});

export const ChartContext = createContext({
  state: {} as ChartState,
  actions: {} as ReturnType<typeof createActions>,
});

export function ChartContextProvider(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialChartState);

  const actions = createActions2(dispatch);

  return (
    <ChartContext.Provider value={{ state, actions }}>
      {props.children}
    </ChartContext.Provider>
  );
}
