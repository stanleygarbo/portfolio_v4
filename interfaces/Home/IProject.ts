export interface IProject {
  title: string;
  img: string;
  description: string;
  roundTxt: string;
  webVer: string;
  slug: string;
  customColors: {
    accent: string;
    foreground: string;
    background: string;
    accentForeground: string;
  };
  customBackground?: string;
}
