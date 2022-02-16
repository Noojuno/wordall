import classNames from "classnames";
import { Button } from "./Button";
import styles from "./Keyboard.module.scss";

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "←"],
];

export function Keyboard({ className }: { className?: string }) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e.key);
  };

  return (
    <div className={classNames(styles.keyboard, className)} onKeyDown={onKeyDown}>
      <KeyRow keys={KEYS[0]} />
      <KeyRow className={styles.middle} keys={KEYS[1]} />
      <KeyRow keys={KEYS[2]} />
    </div>
  );
}

function KeyRow({ keys, className }: { keys: string[]; className?: string }) {
  return (
    <div className={classNames(styles.row, className)}>
      {keys.map((k) => {
        return (
          <Button key={k} className={styles.key}>
            {k}
          </Button>
        );
      })}
    </div>
  );
}
