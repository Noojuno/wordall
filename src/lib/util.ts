export function isLetter(c: string): boolean {
  return c.length === 1 && c.toLowerCase() !== c.toUpperCase();
}

export function isEmpty(str: string | null) {
  return str !== null && str !== "";
}

export function reverse(str: string) {
  let o = "";
  for (let i = str.length - 1; i >= 0; i--) o += str[i];
  return o;
}

export function getRandom(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}
