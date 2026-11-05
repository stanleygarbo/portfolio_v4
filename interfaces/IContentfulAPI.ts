export interface IProjectCollection<T> {
  projectCollection: {
    items: (T | null)[];
  } | null;
}

export interface IImage {
  url: string;
  width: number;
  height: number;
}

export interface IProjectTheme {
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
}

export interface IProjectSummary {
  slug: string;
  previewTitle: string;
  previewDescription: string;
  banner: IImage;
  roundText: string;
  webNumber: string;
  projectNumber: number;
  theme: IProjectTheme;
}

export interface ISingleProjectItem {
  slug: string;
  title: string;
  description: string;
  location: string;
  date: string;
  technologies: string;
  product: string;
  demoUrl: string | null;
  liveUrl: string | null;
  content: {
    caseContent: {
      headlineNumber: string;
      headlineText: string;
      title?: string;
      paragraph1: string;
      paragraph2?: string;
      paragraph3?: string;
      img?: IImage;
    }[];
  } | null;
  theme: IProjectTheme;
}
