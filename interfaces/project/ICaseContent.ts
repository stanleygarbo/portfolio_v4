import { IImage } from "../IContentfulAPI";

export interface ICaseContent {
  headlineNumber?: string;
  headlineText?: string;
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  img?: IImage;
}
