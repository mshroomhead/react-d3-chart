import { DomainTime, ScaleLinear, ScaleTime } from './models';
import { isEqual } from 'lodash';

export function getTimeDelta([from, to]: DomainTime) {
  return to.getTime() - from.getTime();
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

export function zoomIn(domain: DomainTime, zoomFactor: number = 0.5): DomainTime {
  const [from, to] = domain;
  const delta = getTimeDelta(domain);
  const newDelta = delta * zoomFactor;
  const deltaToSubtract = (delta - newDelta) / 2;

  const newFrom = new Date(from.getTime() + deltaToSubtract);
  const newTo = new Date(to.getTime() - deltaToSubtract);
  return [newFrom, newTo];
}

export function zoomOut(domain: DomainTime, zoomFactor: number = 0.5): DomainTime {
  const [from, to] = domain;
  const delta = getTimeDelta(domain);
  const newDelta = delta / zoomFactor;
  const deltaToSubtract = (newDelta - delta) / 2;

  const newFrom = new Date(from.getTime() - deltaToSubtract);
  const newTo = new Date(to.getTime() + deltaToSubtract);
  return [newFrom, newTo];
}
