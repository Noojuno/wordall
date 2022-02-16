import { getGuessStatuses, LetterState } from "../lib/guesses";
import styles from "./Word.module.scss";

interface WordProps {
  word?: string;
  solution: string;
  revealed?: boolean;
}

export function Word({ word = "", solution, revealed }: WordProps) {
  const guess = word + " ".repeat(solution.length - word.length);

  const statuses = getGuessStatuses(solution, guess);

  return (
    <div className={styles.word}>
      {guess.split("").map((l, i) => {
        return <Letter key={i} index={i} letter={l} revealed={revealed} statuses={statuses} />;
      })}
    </div>
  );
}

interface LetterProps {
  index: number;
  letter: string;
  revealed?: boolean;
  statuses: LetterState[];
}

function Letter({ index, letter, revealed, statuses }: LetterProps) {
  return (
    <div className={styles.letter} data-state={revealed ? statuses[index] : "none"} data-animation="flip-in">
      {letter}
    </div>
  );
}
