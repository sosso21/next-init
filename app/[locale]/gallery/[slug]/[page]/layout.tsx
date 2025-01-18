import { RootChildrenGallerySlugPaginationType } from "./types";

export default async function RootLayout({
  children,
  params,
}: RootChildrenGallerySlugPaginationType) {
  return children;
}
