import { stringToSlug } from "./stingToSlug";

export const getPicture = ({
  url,
  author,
}: {
  url?: string | null;
  author: string;
}): string => {
  return (
    url ??
    `https://api.dicebear.com/9.x/initials/webp?seed=${stringToSlug(author)}`
  );
};
