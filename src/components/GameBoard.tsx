import { WordSettings } from "../lib/words";
import { getLetterStates } from "../lib/guesses";

import { Keyboard } from "./Keyboard";
import { Word } from "./Word";
import { isEmpty } from "../lib/util";

import styles from "./GameBoard.module.scss";

interface GameBoardProps {
  settings: WordSettings;
  guesses: string[];
  solution: string;
  currentGuess: string;
  onKeyDown: (key: string) => void;
}

export function GameBoard({ guesses, settings, solution, currentGuess, onKeyDown }: GameBoardProps) {
  const { guessCount } = settings;

  const hasGuesses = guesses.length < guessCount;

  const filledGuesses = [...guesses, ...Array(Math.max(0, guessCount - 1 - guesses.length)).fill("")];
  if (hasGuesses) filledGuesses.splice(guesses.length, 0, currentGuess);

  const didWin = guesses[guesses.length - 1] === solution;
  const isComplete = didWin || guesses.length >= guessCount;

  return (
    <div className={styles.game}>
      <h2>
        {isComplete && (didWin ? <span>Congratulations! </span> : <span>Bad luck! </span>)}
        {isComplete && <span>The word was {solution.toUpperCase()}.</span>}
        {!isComplete && (
          <span>
            GUESSES: ({guesses.length}/{guessCount})
          </span>
        )}
      </h2>

      <div className={styles.words}>
        {filledGuesses.map((guess, i) => {
          const revealed = i !== guesses.length && isEmpty(guess);

          return <Word key={i} solution={solution.toLowerCase()} word={guess} revealed={revealed} />;
        })}
      </div>

      <Keyboard className={styles.keyboard} letterStates={getLetterStates(solution, guesses)} onPressKey={onKeyDown} />
    </div>
  );
}
