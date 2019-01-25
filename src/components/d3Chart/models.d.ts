import { ScaleLinear as D3ScaleLinear, ScaleTime as D3ScaleTime } from 'd3-scale';

export type DomainTime = [Date, Date];
export type DomainLinear = [number, number];

export type ScaleTime = D3ScaleTime<number, number>;
export type ScaleLinear = D3ScaleLinear<number, number>;

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DatumAndPoint<D> {
  datum: D;
  point: Point;
}

export interface Point {
  top: number;
  left: number;
}

export interface Size {
  width: number;
  height: number;
}
