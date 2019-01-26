import { extent } from 'd3-array';
import { default as React, useContext, useEffect } from 'react';
import { DomainTime } from '../../d3Chart/models';
import { xAccessor } from '../Demo';
import { ChartContext } from '../statefull/ChartContext';
import { Chart } from './Chart';

export function ChartWithData() {
  const { state, actions } = useContext(ChartContext);
  const { xDomain, data } = state;
  const { changeXDomain, loadData } = actions;

  // const data = createResource<Datum[]>(
  //   fetch('https://api.iextrading.com/1.0/stock/aapl/chart'),
  //   'data'
  // );

  useEffect(() => {
    loadData();
  }, []);

  if (!data.length) return null;

  if (!xDomain) {
    changeXDomain(extent(data, xAccessor) as DomainTime);
    return null;
  }

  return <Chart data={data} />;
}
