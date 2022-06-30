import { IColors } from "../IColors";

export interface IThemeContext {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: IColors;
  setCustomAccent?: React.Dispatch<React.SetStateAction<string>>;
  setCustomAccentForeground?: React.Dispatch<React.SetStateAction<string>>;
  setCustomBodyColor?: React.Dispatch<React.SetStateAction<string>>;
  setCustomForeground?: React.Dispatch<React.SetStateAction<string>>;
}
