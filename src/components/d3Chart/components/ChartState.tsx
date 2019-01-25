import * as React from 'react';
import { Component, ReactNode } from 'react';
import { DomainLinear, DomainTime } from '../models';

export interface ChartStateProps {
  initialXDomain?: DomainTime;
  initialYDomain?: DomainLinear;
  children(state: ChartStateAndActions): ReactNode;
}

export interface ChartStateAndActions {
  state: ChartStateState;
  actions: {
    changeXDomain(domain: DomainTime, animate?: boolean): void;
    changeYDomain(domain: DomainLinear): void;
  };
}

export interface ChartStateState {
  xDomain?: DomainTime;
  yDomain?: DomainLinear;
  animate: boolean;
}

export class ChartState extends Component<ChartStateProps, ChartStateState> {
  state: ChartStateState = {
    xDomain: this.props.initialXDomain,
    yDomain: this.props.initialYDomain,
    animate: false,
  };

  changeXDomain = (domain: DomainTime, animate: boolean = false) => {
    this.setState({ xDomain: domain, animate });
  };

  changeYDomain = (domain: DomainLinear) => {
    this.setState({ yDomain: domain });
  };

  render() {
    return this.props.children(this.getStateAndActions());
  }

  getStateAndActions() {
    return {
      state: this.state,
      actions: {
        changeXDomain: this.changeXDomain,
        changeYDomain: this.changeYDomain,
      },
    };
  }
}
