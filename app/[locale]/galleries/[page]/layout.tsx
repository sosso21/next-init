import { RootPaginationChildrenType } from "../../reviews/[page]/types";

export default async function RootLayout({
  children,
  params,
}: RootPaginationChildrenType) {
  return children;
}
