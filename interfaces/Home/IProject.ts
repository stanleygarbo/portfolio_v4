export interface IProject {
  title: string;
  img: string;
  imageWidth: number;
  imageHeight: number;
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
