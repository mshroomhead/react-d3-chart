import { createContext, default as React, ReactNode, useState } from 'react';
import { DomainLinear, DomainTime } from '../d3Chart/models';
import { mapActions } from './contextUtils';
import { Datum } from './Demo';

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

const chartActions = (prevState: ChartState = initialChartState) => ({
  async loadData(): Promise<ChartState> {
    const data = await fetch(
      'https://api.iextrading.com/1.0/stock/aapl/chart'
    ).then(r => r.json());

    console.log('chartActions, line 28:', data);

    return { ...prevState, data };
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

  const actions = mapActions(chartActions, setState);

  return (
    <ChartContext.Provider value={{ state, actions }}>
      {props.children}
    </ChartContext.Provider>
  );
}
