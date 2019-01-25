import { bisector } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { ContainerElement, event, mouse, select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components/macro';

import { DomainTime, ScaleLinear, ScaleTime, Size } from '../models';
import { getTimeDelta, isScaleEqual } from '../utils';

export interface OverlayProps<Datum> {
  data: Datum[];
  xScale: ScaleTime;
  yScale: ScaleLinear;
  size: Size;
  maxDomain: DomainTime;
  minDomainDelta?: number;
  isHoverEnabled?: boolean;
  xAccessor(datum: Datum): Date;
  onZoom?(domain: DomainTime): void;
  onZoomStart?(): void;
  onZoomEnd?(): void;
  onHoverDatum?(datum: Datum): void;
  onHoverEnter?(): void;
  onHoverLeave?(): void;
  onClick?(datum: Datum): void;
}

const MIN_ZOOM_FACTOR = 1;
const MAX_ZOOM_FACTOR = Infinity;

/**
 *  _____  ____     _                                                           _
 * |  __ \|___ \   (_)                                                         | |
 * | |  |  __) |    _  ___      ___ ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_
 * | |  | |__ <    | |/ __|    / __/ _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 * | |__| ___) | _ | |\__ \   | (_| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_
 * |_____/____/ (_)| ||___/    \___\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                _/ |                            | |
 *               |__/                             |_|
 *
 * Responsible for registering all mouse event listeners like (custom event) zoom, mousemove, click etc.
 * Already provides information about affected datum and point (coordinates)
 */
export class Overlay<Datum> extends PureComponent<OverlayProps<Datum>> {
  private overlay = React.createRef<SVGRectElement>();
  private zoom = zoom();
  private maxDomainScale = scaleTime();
  private isZooming: boolean = false;

  componentDidMount() {
    this.createMaxDomainScale(this.props);
    this.initOverlay();
    this.updateZoomFactor(this.props);
  }

  componentWillReceiveProps(nextProps: OverlayProps<Datum>) {
    this.update(nextProps);
  }

  update(props: OverlayProps<Datum>) {
    const { size, minDomainDelta, xScale } = props;

    if (size !== this.props.size) {
      this.createMaxDomainScale(props);
      this.updateMinMaxZoomFactor(props);
    }

    // Explicit false because this prevents the initial zoom update
    if (!isScaleEqual(xScale, this.props.xScale) && this.isZooming === false) {
      this.updateZoomFactor(props);
    }

    if (minDomainDelta !== this.props.minDomainDelta) {
      this.updateMaxZoomFactor(props);
    }
  }

  createMaxDomainScale(props: OverlayProps<Datum>) {
    const { maxDomain, size } = props;

    this.maxDomainScale = scaleTime()
      .domain(maxDomain)
      .range([0, size.width]);
  }

  initOverlay() {
    select(this.overlay.current)
      .on('click', this.handleClick)
      .on('mouseover', this.handleHoverEnter)
      .on('mouseout', this.handleHoverOut)
      .on('mousemove', this.handleHover);

    this.zoom = zoom()
      .on('start', this.handleZoomStart)
      .on('zoom', this.handleZoom)
      .on('end', this.handleZoomEnd);

    this.updateMinMaxZoomFactor(this.props);
  }

  updateMinMaxZoomFactor(props: OverlayProps<Datum>) {
    const { width, height } = props.size;

    select(this.overlay.current)
      .attr('width', width)
      .attr('height', height);

    const [maxFrom, maxTo] = this.maxDomainScale.range();
    const extent: [[number, number], [number, number]] = [
      [maxFrom, 0],
      [maxTo, 0],
    ];

    this.zoom.extent(extent);
    this.zoom.translateExtent(extent);

    this.updateMaxZoomFactor(props);

    select(this.overlay.current as Element).call(this.zoom);
  }

  updateMaxZoomFactor(props: OverlayProps<Datum>) {
    const { minDomainDelta, maxDomain } = props;

    let maxScale = MAX_ZOOM_FACTOR;

    if (minDomainDelta) {
      const maxDomainDelta = getTimeDelta(maxDomain);
      maxScale = maxDomainDelta / minDomainDelta;
    }

    this.zoom.scaleExtent([MIN_ZOOM_FACTOR, maxScale]);
  }

  updateZoomFactor(props: OverlayProps<Datum>) {
    const { size, xScale } = props;

    // calculate how the domain would be mapped to pixel values without any zoom
    const unzoomedPixelValues = xScale
      .domain()
      .map<number>(this.maxDomainScale);
    const unzoomedDelta = unzoomedPixelValues[1] - unzoomedPixelValues[0];

    // re-calculate the currently used zoom factor
    const zoomFactor = size.width / unzoomedDelta;

    // move the chart so that the former `unzoomedPixelValues[0]` is at 0 pixels
    const xOffset = -unzoomedPixelValues[0];

    // create new zoom transform for updating the internal d3 zoom state
    const zoomTransform = zoomIdentity.scale(zoomFactor).translate(xOffset, 0);

    // update the internal d3 zoom state
    select(this.overlay.current as Element).call(
      this.zoom.transform,
      zoomTransform
    );
  }

  handleClick = () => {
    const { onClick } = this.props;
    const datum = this.getHoveredDatum();

    if (datum && onClick) {
      onClick(datum);
    }
  };

  handleZoom = () => {
    if (!this.isTriggeredByOverlay()) return;

    const domain = this.getDomain();
    const { onZoom } = this.props;

    if (domain && onZoom) {
      onZoom(domain);
    }
  };

  handleZoomStart = () => {
    if (!this.isTriggeredByOverlay()) return;

    const { onZoomStart } = this.props;

    this.isZooming = true;

    if (onZoomStart) {
      onZoomStart();
    }
  };

  handleZoomEnd = () => {
    if (!this.isZooming) return;

    const { onZoomEnd } = this.props;

    this.isZooming = false;

    if (onZoomEnd) {
      onZoomEnd();
    }
  };

  handleHoverEnter = () => {
    const { isHoverEnabled, onHoverEnter } = this.props;

    if (isHoverEnabled && onHoverEnter) {
      onHoverEnter();
    }
  };

  handleHoverOut = () => {
    const { isHoverEnabled, onHoverLeave } = this.props;

    if (isHoverEnabled && onHoverLeave) {
      onHoverLeave();
    }
  };

  handleHover = () => {
    const { onHoverDatum, isHoverEnabled } = this.props;

    const datum = this.getHoveredDatum();

    if (datum && isHoverEnabled && onHoverDatum) {
      onHoverDatum(datum);
    }
  };

  getHoveredDatum = () => {
    const { xScale, data } = this.props;

    const [mouseX] = mouse(this.overlay.current as ContainerElement);
    const hoveredX = xScale.invert(mouseX);
    const datum = this.findClosestDatum(hoveredX, data);

    if (!datum) {
      return null;
    }

    return datum;
  };

  findClosestDatum(x: Date, data: Datum[]) {
    const { xAccessor } = this.props;

    const index = bisector(xAccessor).left(data, x, 1);

    const datumLeft: Datum = data[index - 1];
    const datumRight: Datum = data[index];

    const xLeft = datumLeft && xAccessor(datumLeft);
    const xRight = datumRight && xAccessor(datumRight);

    const distanceToXLeft = x.getTime() - xLeft.getTime();
    const distanceToXRight = xRight.getTime() - x.getTime();

    return distanceToXLeft > distanceToXRight ? datumRight : datumLeft;
  }

  getDomain() {
    const { sourceEvent, transform } = event;

    if (
      !sourceEvent ||
      sourceEvent.type === 'brush' ||
      sourceEvent.type === 'end'
    ) {
      return;
    }

    return transform.rescaleX(this.maxDomainScale).domain();
  }

  isTriggeredByOverlay = () => {
    return event.sourceEvent;
  };

  render() {
    return (
      <StyledOverlay>
        <rect ref={this.overlay} />
      </StyledOverlay>
    );
  }
}

// -- Styles -- //
const StyledOverlay = styled.g`
  fill: none;
  pointer-events: all;
`;
