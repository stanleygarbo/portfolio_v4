import React from "react";
import styled from "styled-components";

const GradientBubble: React.FC = () => {
  return (
    <Container>
      <div className="g-bubble g-bubble--1"></div>
      <div className="g-bubble g-bubble--2"></div>
      <div className="g-bubble g-bubble--3"></div>
    </Container>
  );
};

const Container = styled.div`
  width: 270px;
  height: 270px;
  border-radius: 100%;
  position: relative;
  overflow: hidden;
  filter: blur(35px);

  .g-bubble {
    width: 250px;
    height: 250px;
    position: absolute;
    border-radius: 100%;

    &--1 {
      background: #ff3434;
      bottom: 0;
      right: 0;
    }
    &--2 {
      background: #ff2b6a;
      bottom: 0;
    }
    &--3 {
      background: #8766ff;
      animation: move3 8s infinite;
    }

    @keyframes move3 {
      0% {
        top: -100px;
        left: 75px;
      }
      50% {
        top: 0px;
        left: 0px;
      }
      100% {
        top: -100px;
        left: 75px;
      }
    }
  }
`;

export default GradientBubble;
