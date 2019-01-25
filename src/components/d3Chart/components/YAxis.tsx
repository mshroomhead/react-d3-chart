import { axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import * as React from 'react';
import { Component } from 'react';

import { ScaleLinear } from '../models';

export interface YAxisProps {
  yScale: ScaleLinear;
  formatTick?(number: number): string;
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
export class YAxis extends Component<YAxisProps> {
  private element = React.createRef<SVGGElement>();

  componentDidMount() {
    this.update(this.props);
  }

  componentDidUpdate(prevProps: YAxisProps) {
    if (prevProps.yScale !== this.props.yScale) {
      this.update(this.props);
    }
  }

  update(props: YAxisProps) {
    const { yScale, formatTick } = props;

    const xAxis = axisLeft<number>(yScale);

    if (formatTick) {
      xAxis.tickFormat(formatTick);
    }

    select(this.element.current as SVGSVGElement).call(xAxis);
  }

  render() {
    return <g ref={this.element} />;
  }
}
