export interface IProjectCollection {
  data: {
    projectCollection: {
      items: ISingleProjectItem[];
    };
  };
}

export interface IImage {
  url: string;
  width: number;
  height: number;
}

export interface ISingleProjectItem {
  slug: string;
  title: string;
  previewTitle: string;
  description: string;
  previewDescription: string;
  location: string;
  date: string;
  technologies: string;
  product: string;
  banner: IImage;
  roundText: string;
  webNumber: string;
  demoUrl: string;
  content: {
    caseContent: {
      headlineNumber: string;
      headlineText: string;
      title?: string;
      paragraph1: string;
      paragraph2?: string;
      img?: IImage;
    }[];
  };
  theme: {
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
  };
}
