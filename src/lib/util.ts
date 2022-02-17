export function isLetter(c: string): boolean {
  return c.length == 1 && c.toLowerCase() != c.toUpperCase();
}

export function isEmpty(c: string | null) {
  return c !== null && c !== "";
}
