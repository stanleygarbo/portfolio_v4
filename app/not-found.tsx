import type { Metadata } from "next";
import Layout from "../components/Layout";
import NotFoundContent from "../components/NotFound";

export const metadata: Metadata = {
  title: { absolute: "404 | Page Not Found" },
  description: "This page does not exist.",
};

export default function NotFound() {
  return (
    <Layout>
      <NotFoundContent />
    </Layout>
  );
}
