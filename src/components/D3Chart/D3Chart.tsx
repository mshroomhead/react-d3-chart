import { scaleLinear, scaleTime } from 'd3-scale';
import * as React from 'react';
import { PureComponent, ReactNode } from 'react';
import { isEqual } from 'lodash';
import {
  DomainLinear,
  DomainTime,
  Spacing,
  DatumAndPoint,
  Size,
  ScaleTime,
  ScaleLinear,
} from './d3Chart.models';
import { Overlay } from './D3ChartOverlay';
import { ResponsiveContainer } from './ResponsiveContainer';

export interface D3ChartProps<Datum> {
  /**
   * Base data structure
   * Assumption: One distinct x-value can have 1 or more y-values
   */
  data: Datum[];

  /**
   * Visible time window
   */
  xDomain: DomainTime;

  /**
   * Min and max values for the y-values
   */
  yDomain: DomainLinear;

  /**
   * Space for the axes that is added around the chart content
   */
  margin: Spacing;

  /**
   * Min and max values for the x-values
   */
  maxXDomain: DomainTime;

  /**
   * Minimal zoom level
   */
  minDomainDelta?: number;

  /**
   * If false completely disables all interactive functionality
   */
  isInteractive?: boolean;

  /**
   * Adds some space around the chart content
   */
  padding?: Spacing;

  /**
   * If true, d3 brush will be enabled instead of d3 zoom
   */
  isBrushEnabled?: boolean;

  /**
   * If true, no hover callbacks will be triggered
   */
  isHoverEnabled?: boolean;

  /**
   * With children as render function every child component has access to the current state of the chart including
   * xScale and yScale and will be rendered as content of the chart.
   * @param {D3ChartState} chart
   * @returns {React.ReactNode}
   */
  children(chart: D3ChartState<Datum>): ReactNode;

  /**
   * Callback to update the xDomain to be able to set it from outside the chart
   * @param {Domain} domain
   */
  onZoom?(domain: DomainTime): void;

  /**
   * Callback called after the d3 brush end event is triggered
   * @param {Domain} domain
   */
  onBrush?(domain: DomainTime): void;

  /**
   * Useful for e.g. to disable tooltips
   */
  onZoomStart?(): void;

  /**
   * Useful to e.g. sync xDomain with the url etc.
   */
  onZoomEnd?(): void;

  /**
   * Callback to e.g. show tooltips
   * @param {DatumAndPoint} datum
   */
  onHoverChange?(datum: Datum): void;
  onHoverEnter?(): void;
  onHoverLeave?(): void;

  /**
   * Callback to store the chart size if needed
   * @param {Size} size
   */
  onSizeChange?(size: Size): void;

  /**
   * Access the x value of the datum
   * @param {Datum} datum
   * @returns {Date}
   */
  xAccessor(datum: Datum): Date;
}

export interface D3ChartState<Datum> {
  size: Size;
  data: Datum[];
  contentSize: Size;
  xScale: ScaleTime;
  yScale: ScaleLinear;
  hoveredDatum: Datum | null;
  clickedDatum: Datum | null;
}

function createScales<Datum>(props: D3ChartProps<Datum>, size: Size) {
  const {
    data,
    xDomain,
    yDomain,
    padding = { top: 0, left: 0, bottom: 0, right: 0 },
  } = props;
  const { top, left, bottom, right } = padding;
  const { width, height } = size;

  return {
    xScale: scaleTime()
      .domain(xDomain)
      .range([left, width - right]),
    yScale: scaleLinear()
      .domain(yDomain)
      .range([height - bottom, top]),
    data,
  };
}

/**
 * This class provides a base d3 chart with axes, zoom and brush
 * that can be easily extended with arbitrary content.
 * The child components can use the chart state including interactivity information and
 * current scaling with which they have to take care about their update themselves.
 */
export class D3Chart<Datum> extends PureComponent<
  D3ChartProps<Datum>,
  D3ChartState<Datum>
> {
  static getDerivedStateFromProps<D>(
    props: D3ChartProps<D>,
    prevState: D3ChartState<D>
  ) {
    if (
      !isEqual(props.xDomain, prevState.xScale.domain()) ||
      !isEqual(props.yDomain, prevState.yScale.domain()) ||
      props.data !== prevState.data
    ) {
      return createScales(props, prevState.contentSize);
    }

    return null;
  }

  constructor(props: D3ChartProps<Datum>) {
    super(props);

    this.state = {
      data: [],
      size: { width: 0, height: 0 },
      contentSize: { width: 0, height: 0 },
      xScale: scaleTime(),
      yScale: scaleLinear(),
      hoveredDatum: null,
      clickedDatum: null,
    };
  }

  handleSizeChange = (size: Size) => {
    const { onSizeChange } = this.props;

    const contentSize = this.getContentSize(size);
    this.setState({
      size,
      contentSize,
      ...createScales(this.props, contentSize),
    });

    if (onSizeChange) {
      onSizeChange(contentSize);
    }
  };

  handleHover = (datum: Datum) => {
    const { onHoverChange } = this.props;

    this.setState({ hoveredDatum: datum });

    if (onHoverChange) {
      onHoverChange(datum);
    }
  };

  handleClick = (datum: Datum) => {
    this.setState({ clickedDatum: datum });
  };

  handleBrushEnd = (domain: DomainTime) => {
    const { onBrush, onZoomEnd } = this.props;

    if (onBrush) {
      onBrush(domain);
    }

    if (onZoomEnd) {
      onZoomEnd();
    }
  };

  render() {
    const {
      data,
      xAccessor,
      maxXDomain,
      minDomainDelta,
      margin: { left, top },
      isInteractive = true,
      children,
      isBrushEnabled,
      isHoverEnabled = true,
      onZoom,
      onZoomStart,
      onZoomEnd,
      onHoverEnter,
      onHoverLeave,
    } = this.props;
    const { xScale, yScale, size, contentSize } = this.state;

    return (
      <ResponsiveContainer onSizeChange={this.handleSizeChange}>
        <svg data-test-id="Chart" width={size.width} height={size.height}>
          <g transform={`translate(${left}, ${top})`}>
            {isInteractive && (
              <Overlay
                data={data}
                xAccessor={xAccessor}
                xScale={xScale}
                yScale={yScale}
                size={contentSize}
                maxDomain={maxXDomain}
                minDomainDelta={minDomainDelta || 0}
                onHoverDatum={this.handleHover}
                onHoverEnter={onHoverEnter}
                onHoverLeave={onHoverLeave}
                isHoverEnabled={isHoverEnabled}
                onClick={this.handleClick}
                onZoom={onZoom}
                onZoomStart={onZoomStart}
                onZoomEnd={onZoomEnd}
              />
            )}
            {children(this.state)}
          </g>
        </svg>
      </ResponsiveContainer>
    );
  }

  private getContentSize(size: Size) {
    const { top, left, bottom, right } = this.props.margin;
    const { width, height } = size;

    return {
      width: width - left - right,
      height: height - top - bottom,
    };
  }
}
