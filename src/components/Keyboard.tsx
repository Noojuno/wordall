import { Button } from "./Button";
import styles from "./Keyboard.module.scss";

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "←"],
];

export function Keyboard() {
  return (
    <div className={styles.keyboard}>
      <KeyRow keys={KEYS[0]} />
      <KeyRow keys={KEYS[1]} />
      <KeyRow keys={KEYS[2]} />
    </div>
  );
}

function KeyRow({ keys }: { keys: string[] }) {
  return (
    <div className={styles.row}>
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
