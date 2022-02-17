export interface WordSettings {
  word: string;
  guesses: number;
}

const DEFAULT_SETTINGS: Omit<WordSettings, "word"> = {
  guesses: 6,
};

export { DEFAULT_SETTINGS };

export function getLetters(words: string[]): string[] {
  return words
    .flatMap((word) => word.split(""))
    .filter((letter, i, self) => {
      return self.indexOf(letter) === i;
    });
}
