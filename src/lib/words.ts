export interface WordSettings {
  word?: string;
  guessCount: number;
  length: number;
  random?: boolean;
}

const DEFAULT_SETTINGS: WordSettings = {
  guessCount: 6,
  length: 5,
  random: true,
};

export { DEFAULT_SETTINGS };

export function getLetters(words: string[]): string[] {
  return words
    .flatMap((word) => word.split(""))
    .filter((letter, i, self) => {
      return self.indexOf(letter) === i;
    });
}
