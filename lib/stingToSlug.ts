export function stringToSlug(str: string): string {
  // Convert to lowercase
  str = str.toLowerCase();

  // Replace accented characters with their non-accented equivalents
  const accentsMap = new Map<string, string>([
    ["á", "a"],
    ["é", "e"],
    ["í", "i"],
    ["ó", "o"],
    ["ú", "u"],
    ["à", "a"],
    ["è", "e"],
    ["ì", "i"],
    ["ò", "o"],
    ["ù", "u"],
    ["â", "a"],
    ["ê", "e"],
    ["î", "i"],
    ["ô", "o"],
    ["û", "u"],
    ["ä", "a"],
    ["ë", "e"],
    ["ï", "i"],
    ["ö", "o"],
    ["ü", "u"],
    ["ã", "a"],
    ["õ", "o"],
    ["ç", "c"],
    ["ñ", "n"],
  ]);
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
  str = Array.from(str)
    .map((char) => accentsMap.get(char) || char)
    .join("");

  // Replace spaces and other unwanted characters with hyphens
  str = str.replace(/[\s\W-]+/g, "-");

  // Remove hyphens at the beginning and end of the string
  str = str.replace(/^-+|-+$/g, "-");

  return str;
}
