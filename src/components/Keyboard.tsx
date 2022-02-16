import classNames from "classnames";
import styles from "./Keyboard.module.scss";

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "←"],
];

interface KeyboardProps {
  guessedLetters: string[];
  className?: string;
  onPressKey: (key: string) => void;
}

export function Keyboard({ guessedLetters, onPressKey, className }: KeyboardProps) {
  return (
    <div className={classNames(styles.keyboard, className)}>
      <KeyRow keys={KEYS[0]} guessedLetters={guessedLetters} onPressKey={onPressKey} />
      <KeyRow keys={KEYS[1]} guessedLetters={guessedLetters} middle onPressKey={onPressKey} />
      <KeyRow keys={KEYS[2]} guessedLetters={guessedLetters} onPressKey={onPressKey} />
    </div>
  );
}

interface KeyRowProps {
  keys: string[];
  guessedLetters: string[];
  className?: string;
  middle?: boolean;
  onPressKey: (key: string) => void;
}

function KeyRow({ keys, guessedLetters, className, middle, onPressKey }: KeyRowProps) {
  return (
    <div className={classNames(styles.row, className, { [styles.middle]: middle })}>
      {keys.map((key) => {
        const state = guessedLetters.includes(key.toLowerCase()) ? "incorrect" : "none";

        return (
          <button key={key} className={styles.key} data-state={state} onClick={() => onPressKey(key.toLowerCase())}>
            {key}
          </button>
        );
      })}
    </div>
  );
}
