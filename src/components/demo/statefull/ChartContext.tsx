import { createContext, default as React, ReactNode, useState } from 'react';
import { DomainLinear, DomainTime } from '../../d3Chart/models';
import { Datum } from '../Demo';
import { injectPrevState } from './contextUtils';

interface ChartState {
  xDomain: DomainTime | undefined;
  yDomain: DomainLinear | undefined;
  animate: boolean;
  color: string;
  data: Datum[];
}

const initialChartState: ChartState = {
  xDomain: undefined,
  yDomain: [100, 200],
  animate: false,
  color: '#0088cc',
  data: [],
};

const chartActions = (
  setState?: (state: ChartState) => void,
  prevState: ChartState = initialChartState
) => ({
  setData(data: Datum[]): ChartState {
    return { ...prevState, data };
  },

  loadData(): ChartState {
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart')
      .then(res => res.json())
      .then(data => {
        setState!(this.setData(data));
      });

    return prevState;
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
  state: initialChartState,
  actions: chartActions(),
});

export function ChartContextProvider(props: { children: ReactNode }) {
  const [state, setState] = useState(initialChartState);

  const actions = injectPrevState(chartActions, setState);

  return (
    <ChartContext.Provider value={{ state, actions }}>
      {props.children}
    </ChartContext.Provider>
  );
}
