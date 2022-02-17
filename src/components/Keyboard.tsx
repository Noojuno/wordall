import classNames from "classnames";
import { LetterStateDict } from "../lib/guesses";
import styles from "./Keyboard.module.scss";

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "←"],
];

interface KeyboardProps {
  letterStates: LetterStateDict;
  className?: string;
  onPressKey: (key: string) => void;
}

export function Keyboard({ letterStates, onPressKey, className }: KeyboardProps) {
  return (
    <div className={classNames(styles.keyboard, className)}>
      <KeyRow keys={KEYS[0]} letterStates={letterStates} onPressKey={onPressKey} />
      <KeyRow keys={KEYS[1]} letterStates={letterStates} middle onPressKey={onPressKey} />
      <KeyRow keys={KEYS[2]} letterStates={letterStates} onPressKey={onPressKey} />
    </div>
  );
}

interface KeyRowProps {
  keys: string[];
  letterStates: LetterStateDict;
  className?: string;
  middle?: boolean;
  onPressKey: (key: string) => void;
}

function KeyRow({ keys, letterStates, className, middle, onPressKey }: KeyRowProps) {
  return (
    <div className={classNames(styles.row, className, { [styles.middle]: middle })}>
      {keys.map((key) => {
        const state = letterStates[key.toLowerCase()] || "none";

        return (
          <button key={key} className={styles.key} data-state={state} onClick={() => onPressKey(key.toLowerCase())}>
            {key}
          </button>
        );
      })}
    </div>
  );
}
