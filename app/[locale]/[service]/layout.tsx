import { RootServiceChildrenType, ServiceArray } from "./types";

export async function generateStaticParams() {
  return ServiceArray;
}

export default function RootLayout({
  children,
  params,
}: RootServiceChildrenType) {
  return children;
}
