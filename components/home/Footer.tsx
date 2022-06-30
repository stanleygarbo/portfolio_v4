import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { FiGithub, FiTwitter } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import ContentBox from "../ContentBox";

const Footer = () => {
  const { colors } = useTheme();

  return (
    <Container colors={colors} id="contact">
      <h2>Like What You&apos;re Seeing?</h2>
      <p>Don&apos;t hesitate to contact me for inquiries or questions</p>
      <div className="socials">
        <ContentBox backgroundColor={colors.foreground1}>
          <a
            href="https://github.com/stanleygarbo"
            target="_blank"
            rel="noreferrer"
          >
            <FiGithub size={20} />
            @stanleygarbo
          </a>
        </ContentBox>
        <ContentBox backgroundColor={colors.foreground1}>
          <a
            href="mailto:stanleygarbo@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            <HiOutlineMail size={20} />
            stanleygarbo@gmail.com
          </a>
        </ContentBox>
        <ContentBox backgroundColor={colors.foreground1}>
          <a
            href="https://twitter.com/digital_mad_lad"
            target="_blank"
            rel="noreferrer"
          >
            <FiTwitter size={20} />
            @digital_mad_lad
          </a>
        </ContentBox>
      </div>
      <p>
        Made with <span>❤️</span> by yours truly
      </p>
    </Container>
  );
};

const Container = styled.footer<{ colors: IColors }>`
  ${({ colors }) => css`
    margin-top: 150px;
    background: #ffffff10;
    padding-top: 100px;
    padding-bottom: 30px;

    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      color: ${colors.foreground1};
    }

    p {
      color: ${colors.foreground1}99;
      font-weight: 300;
      font-size: 15px;

      text-align: center;
      span {
        color: #ffffff;
      }
    }

    .socials {
      display: flex;
      gap: 20px;
      margin-top: 40px;
      margin-bottom: 150px;
      a {
        display: flex;
        text-decoration: none;
        background: ${colors.customAccent
          ? colors.customAccent
          : colors.accent};
        color: ${colors.customAccentForeground
          ? colors.customAccentForeground
          : colors.foreground1};
        padding: 10px 20px;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
        gap: 15px;
      }
    }

    @media (max-width: 1014px) {
      .socials {
        flex-direction: column;
      }
    }
  `}
`;

export default Footer;
