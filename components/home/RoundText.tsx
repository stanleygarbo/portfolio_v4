import styled from "styled-components";
import { useTheme } from "../../contexts/themeContext";

const RoundText = () => {
  const { colors } = useTheme();

  return (
    <Container>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 133.43 133.42"
        xmlSpace="preserve"
      >
        <path
          id="a"
          d="M116.71 66.74c0 27.61-22.39 50-50 50s-50-22.39-50-50 22.39-50 50-50 50 22.38 50 50z"
          style={{
            fill: "none",
          }}
        />
        <text fill="currentColor">
          <textPath xlinkHref="#a">
            <tspan
              style={{
                fontSize: 16,
                color: colors.foreground1,
                letterSpacing: 4,
              }}
            >
              {"FREELANCE WEB DEVELOPER"}
            </tspan>
          </textPath>
        </text>
      </svg>
    </Container>
  );
};

const Container = styled.div`
  animation: rotation 20s linear infinite;
  width: 100%;
  height: 100%;
  /* background: red; */

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;

export default RoundText;
