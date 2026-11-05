import { useWindowScrollPosition } from "@n8tb1t/use-scroll-position";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IContentBox } from "../interfaces/IContentBox";

const ContentBox: React.FC<IContentBox> = ({
  children,
  backgroundColor,
  ...props
}) => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!shouldAnimate) return;
    const timer = setTimeout(
      () => setIsShown(true),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700,
    );
    return () => clearTimeout(timer);
  }, [shouldAnimate]);

  useWindowScrollPosition(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // check if object is in viewport
      if (rect.top - (window.innerHeight - 50) < 0) {
        setShouldAnimate(true);
      }
    }
  });

  return (
    <Container ref={containerRef} {...props}>
      <div
        style={{ background: backgroundColor }}
        className={`content-box-cover ${
          shouldAnimate ? "content-box-cover--show" : ""
        }`}
      ></div>
      <div className="child" style={{ opacity: isShown ? 1 : 0 }}>
        {children}
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  .content-box-cover {
    position: absolute;
    width: 0%;
    height: 100%;
    z-index: 2;

    &--show {
      animation: goRight 1.4s cubic-bezier(0.65, 0.05, 0.36, 1);

      @keyframes goRight {
        0% {
          width: 0%;
        }
        50% {
          width: 100%;
        }
        100% {
          width: 0%;
          right: 0;
        }
      }
    }
  }
`;

export default ContentBox;
