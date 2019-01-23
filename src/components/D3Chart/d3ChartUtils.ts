import { DomainTime, ScaleLinear, ScaleTime } from './d3Chart.models';
import { isEqual } from 'lodash';

export function getTimeDelta(domain: DomainTime) {
  return domain[1].getTime() - domain[0].getTime();
}

export function isScaleEqual<T extends ScaleTime | ScaleLinear>(
  scale1: T,
  scale2: T
) {
  return (
    isEqual(scale1.range(), scale2.range()) &&
    isEqual(scale1.domain(), scale2.domain())
  );
}

export function getClipPathUrl(id?: string) {
  return id ? `url(#${id})` : '';
}