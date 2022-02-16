import styles from "./Word.module.scss";

type ReactElement = JSX.Element | JSX.Element[] | string | string[];

export function Word({ children }: { children?: string }) {
  const word = children || "     ";

  return (
    <div className={styles.word}>
      {word.split("").map((l, i) => {
        return <Letter key={i}>{l}</Letter>;
      })}
    </div>
  );
}

function Letter({ children }: { children: ReactElement }) {
  return <div className={styles.letter}>{children}</div>;
}
