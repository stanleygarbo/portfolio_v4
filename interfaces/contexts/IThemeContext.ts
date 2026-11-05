import type { Dispatch, SetStateAction } from "react";
import type { IColors } from "../IColors";
import type { IProjectTheme } from "../IContentfulAPI";

export interface IThemeContext {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: IColors;
  setProjectTheme: Dispatch<SetStateAction<IProjectTheme | null>>;
}
