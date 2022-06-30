import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { FiGithub, FiFacebook } from "react-icons/fi";

const SideSocials: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <div className="icon">
        <FiGithub size={25} />
      </div>
      <div className="icon">
        <FiFacebook size={25} />
      </div>
      <div className="vert-line"></div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    z-index: 5;

    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 50px;

    .icon {
      margin-bottom: 20px;
      color: ${colors.customAccent ? colors.customAccent : colors.foreground1};
    }

    .vert-line {
      height: 170px;
      width: 1px;
      background: ${colors.customAccent
        ? colors.customAccent
        : colors.foreground1};
    }

    @media (max-width: 850px) {
      display: none;
    }
  `}
`;

export default SideSocials;
