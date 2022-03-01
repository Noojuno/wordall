import { useEffect, useState } from "react";
import { getGuessStates, LetterState } from "../lib/guesses";
import styles from "./Word.module.scss";

const ANIMATION_DELAY = 0.4;

interface WordProps {
  word?: string;
  solution: string;
  revealed?: boolean;
}

// TODO: Letter reveal currently uses state, which is fine but I would rather it not or at least have state in game board
export function Word({ word = "", solution, revealed }: WordProps) {
  const [animate, setAnimate] = useState<boolean>(true);

  const guess = word + " ".repeat(solution.length - word.length);
  const states = getGuessStates(solution, guess);

  useEffect(() => {
    if (!revealed) return;

    setTimeout(() => setAnimate(false), word.length * ANIMATION_DELAY * 1000);
  }, [revealed, word]);

  return (
    <div className={styles.word}>
      {guess.split("").map((letter, i) => {
        return <Letter key={i} letter={letter} state={states[i]} revealed={revealed} delay={animate ? i * ANIMATION_DELAY : 0} />;
      })}
    </div>
  );
}

interface LetterProps {
  letter: string;
  revealed?: boolean;
  state: LetterState;
  delay?: number;
}

function Letter({ letter, revealed, state, delay = 0 }: LetterProps) {
  const delayStyle = { animationDelay: `${delay}s`, transitionDelay: `${delay}s` };
  const noTransitionStyle = { transition: "none" };

  return (
    <div className={styles.letter} data-state={revealed ? state : "none"} style={!revealed || delay <= 0 ? noTransitionStyle : delayStyle}>
      {letter}
    </div>
  );
}
