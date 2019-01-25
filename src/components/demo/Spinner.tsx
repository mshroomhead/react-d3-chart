import * as React from 'react';
import styled, { keyframes } from 'styled-components/macro';

export function Spinner() {
  return (
    <SpinnerWrapper>
      <Scale>
        <StyledSpinner />
      </Scale>
    </SpinnerWrapper>
  );
}

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const scale = keyframes`
  100% {
    transform: scale(1);
  }
  
  50% {
    transform: scale(1.2);
  }

  0% {
    transform: scale(1);
  }
`;

const Scale = styled.div`
  animation: ${scale} 1s linear infinite;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 100%;
  border: 2px solid #0088cc;
  border-right-color: transparent;
  animation: ${spin} 1s linear infinite;
`;
