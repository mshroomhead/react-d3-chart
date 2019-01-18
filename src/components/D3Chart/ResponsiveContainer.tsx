import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';

export interface ResponsiveContainerProps {
  children: any;
  onSizeChange: Function;
}

export interface ResponsiveContainerState {
  width: number;
  height: number;
}

export class ResponsiveContainer extends Component<ResponsiveContainerProps, ResponsiveContainerState> {
  private element = React.createRef<HTMLDivElement>();

  constructor(props: ResponsiveContainerProps) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (!this.element.current) return;

    const width = this.element.current.getBoundingClientRect().width;
    const height = this.element.current.getBoundingClientRect().height;

    if (width === this.state.width && height === this.state.height) return;

    this.setState({ width, height });

    this.props.onSizeChange({ width, height });
  };

  render() {
    return (
      <StyledResponsiveContainer ref={this.element}>
        <AbsoluteContainer>{this.state.height && this.state.width ? this.props.children : null}</AbsoluteContainer>
      </StyledResponsiveContainer>
    );
  }
}

const StyledResponsiveContainer = styled.div`
  height: 100%;
  position: relative;
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
