import { StringLiteralLike } from "typescript";
import { getGuessStates, LetterState } from "../lib/guesses";
import styles from "./Word.module.scss";

interface WordProps {
  word?: string;
  solution: string;
  revealed?: boolean;
}

export function Word({ word = "", solution, revealed }: WordProps) {
  const guess = word + " ".repeat(solution.length - word.length);
  const states = getGuessStates(solution, guess);

  return (
    <div className={styles.word}>
      {guess.split("").map((letter, i) => {
        return <Letter key={i} letter={letter} state={states[i]} revealed={revealed} />;
      })}
    </div>
  );
}

interface LetterProps {
  letter: string;
  revealed?: boolean;
  state: LetterState;
}

function Letter({ letter, revealed, state }: LetterProps) {
  return (
    <div className={styles.letter} data-state={revealed ? state : "none"}>
      {letter}
    </div>
  );
}
