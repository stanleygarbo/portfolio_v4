import type { Metadata } from "next";
import NotFoundContent from "../../../components/NotFound";
import { metadata as notFoundMetadata } from "../../not-found";

export const metadata: Metadata = {
  ...notFoundMetadata,
  robots: { index: false },
};

export default function PageNotFound() {
  return <NotFoundContent />;
}
