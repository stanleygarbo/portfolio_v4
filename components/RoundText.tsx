import React from "react";
import { useTheme } from "../contexts/themeContext";
import { IRoundText } from "../interfaces/IRoundText";

const RoundText: React.FC<IRoundText> = ({ text, letterSpacing, fontSize }) => {
  const { colors } = useTheme();

  return (
    <svg viewBox="0 0 192.07 192.07">
      <path
        id="circle"
        d="M182.04 96.04c0 47.5-38.5 86-86 86s-86-38.5-86-86 38.5-86 86-86 86 38.51 86 86z"
        style={{
          fill: "none",
        }}
      />
      <text
        // width={500}
        fill="currentColor"
        style={{
          color: colors.customForeground
            ? colors.customForeground
            : colors.foreground1,
        }}
      >
        <textPath xlinkHref="#circle">
          <tspan
            style={{
              fontSize: fontSize ? fontSize : 12,
              letterSpacing,
            }}
          >
            {text}
          </tspan>
        </textPath>
      </text>
    </svg>
  );
};

export default RoundText;
