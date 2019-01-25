import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import * as React from 'react';
import { Component } from 'react';

import { ScaleTime, Size } from '../models';

export interface XAxisProps {
  xScale: ScaleTime;
  size: Size;
  formatTick?(date: Date): string;
}

/**
 *  _____  ____     _                                                          _
 * |  __ \|___ \   (_)                                                         | |
 * | |  |  __) |    _  ___      ___ ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_
 * | |  | |__ <    | |/ __|    / __/ _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 * | |__| ___) | _ | |\__ \   | (_| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_
 * |_____/____/ (_)| ||___/    \___\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                _/ |                            | |
 *               |__/                             |_|
 *
 * Generates the D3.js axes
 */
export class XAxis extends Component<XAxisProps> {
  private element = React.createRef<SVGGElement>();

  componentDidMount() {
    this.update(this.props);
  }

  componentDidUpdate(prevProps: XAxisProps) {
    if (
      prevProps.xScale !== this.props.xScale ||
      prevProps.size !== this.props.size
    ) {
      this.update(this.props);
    }
  }

  update(props: XAxisProps) {
    const {
      xScale,
      size: { height },
      formatTick,
    } = props;

    const xAxis = axisBottom<Date>(xScale);

    if (formatTick) {
      xAxis.tickFormat(formatTick);
    }

    select(this.element.current as SVGSVGElement)
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);
  }

  render() {
    return <g ref={this.element} />;
  }
}
