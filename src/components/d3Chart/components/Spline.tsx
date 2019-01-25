import { easeSinInOut } from 'd3-ease';
import { select } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';
import { isDate } from 'lodash';
import * as React from 'react';
import { PureComponent } from 'react';

import styled, { FlattenSimpleInterpolation } from 'styled-components';
import { ScaleLinear, ScaleTime } from '../models';
import { getClipPathUrl } from '../utils';

export interface SplineProps<Datum> {
  data: Datum[];
  xScale: ScaleTime;
  yScale: ScaleLinear;
  styles?: FlattenSimpleInterpolation;
  animateScale?: boolean;
  animateLine?: boolean;
  clipPathId?: string;
  strokeWidth?: number;
  xAccessor(d: Datum): Date;
  yAccessor(d: Datum): number;
}

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
 * Chart content for spline chart
 */
export class Spline<Datum> extends PureComponent<SplineProps<Datum>> {
  private element = React.createRef<SVGPathElement>();

  componentDidMount() {
    this.update();
    animateLine(this.element.current as SVGPathElement);
  }

  componentDidUpdate(prevProps: SplineProps<Datum>) {
    if (
      prevProps.xScale !== this.props.xScale ||
      prevProps.yScale !== this.props.yScale ||
      prevProps.data !== this.props.data
    ) {
      this.update();
    }
  }

  update() {
    console.count('spline update');
    const { animateScale } = this.props;

    const selection = select(this.element.current);

    const pathData = this.pathData();

    if (animateScale) {
      selection
        .transition()
        .duration(200)
        .attr('d', pathData);
    } else {
      selection.attr('d', pathData);
    }
  }

  pathData() {
    const { data, xScale, yScale, xAccessor, yAccessor } = this.props;

    return line<Datum>()
      .defined(d => isDate(xAccessor(d)) && isFinite(yAccessor(d)))
      .x((d: Datum) => xScale(xAccessor(d)))
      .y((d: Datum) => yScale(yAccessor(d)))
      .curve(curveMonotoneX)(data)!;
  }

  render() {
    console.count('Spline render');
    const { clipPathId, styles } = this.props;
    const clipPath = getClipPathUrl(clipPathId);

    return <Path ref={this.element} clipPath={clipPath} styles={styles} />;
  }
}

// ----==== Styles ====---- //
const Path = styled.path`
  fill: none;
  pointer-events: none;

  ${({ styles }: Pick<SplineProps<any>, 'styles'>) => styles};
`;

// ----==== Helpers ====---- //
export function animateLine(line: SVGPathElement) {
  const lineLength = line.getTotalLength();

  select(line)
    .attr('stroke-dasharray', lineLength)
    .attr('stroke-dashoffset', lineLength)
    .transition()
    .duration(1000)
    .ease(easeSinInOut)
    .attr('stroke-dashoffset', 0)
    .on('end', function(this: SVGPathElement) {
      select(this).attr('stroke-dasharray', 'none');
    });
}
