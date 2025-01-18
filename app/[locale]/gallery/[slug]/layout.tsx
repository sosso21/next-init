import { RootChildrenGallerySlugType } from "./types";

export default async function RootLayout({
  children,
  params,
}: RootChildrenGallerySlugType) {
  return children;
}
