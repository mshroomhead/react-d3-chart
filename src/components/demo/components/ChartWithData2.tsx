import { extent } from 'd3-array';
import { default as React, useContext, useEffect } from 'react';
import { DomainTime } from '../../d3Chart/models';
import { xAccessor } from '../Demo';
import { ChartContext } from '../statefull/ChartContext2';
import { Chart } from './Chart';
import { Spinner } from './Spinner';

export function ChartWithData2() {
  const { state, actions } = useContext(ChartContext);
  const { xDomain, data } = state;
  const { changeXDomain, loadData } = actions;

  useEffect(() => {
    loadData();
  }, []);

  if (data.isEmpty) return null;
  if (data.isLoading) return <Spinner />;
  if (data.isFailed) return <span>Error...</span>;

  if (!xDomain) {
    changeXDomain(extent(data.value, xAccessor) as DomainTime);
    return null;
  }

  return <Chart data={data.value} />;
}
