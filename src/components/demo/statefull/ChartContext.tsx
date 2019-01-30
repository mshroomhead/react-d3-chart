import {
  createContext,
  default as React,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { DomainLinear, DomainTime } from '../../d3Chart/models';
import { Datum } from '../Demo';
import { Loadable } from '../models';
import { createActions } from './contextUtils';

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

const chartActions = (
  prevState: ChartState = initialChartState,
  setState: Dispatch<SetStateAction<ChartState>>
) => ({
  setData(data: Loadable<Datum[]>): ChartState {
    return { ...prevState, data };
  },

  loadData(): ChartState {
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart')
      .then(res => res.json())
      .then(data => {
        setState(this.setData(Loadable.Valid(data)));
      })
      .catch(() => {
        setState(this.setData(Loadable.Failed()));
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

export const ChartContext = createContext({
  state: {} as ChartState,
  actions: {} as ReturnType<typeof chartActions>,
});

export function ChartContextProvider(props: { children: ReactNode }) {
  const [state, setState] = useState(initialChartState);

  const actions = createActions(chartActions, setState);

  return (
    <ChartContext.Provider value={{ state, actions }}>
      {props.children}
    </ChartContext.Provider>
  );
}
