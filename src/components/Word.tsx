import styles from "./Word.module.scss";

type ReactElement = JSX.Element | JSX.Element[] | string | string[];

const actualWord = "RENTS";

export function Word({ children }: { children?: string }) {
  const word = children || "     ";

  return (
    <div className={styles.word}>
      {word.split("").map((l, i) => {
        return (
          <Letter actualWord={actualWord} index={i} key={i}>
            {l}
          </Letter>
        );
      })}
    </div>
  );
}

type LetterState = "correct" | "close" | "incorrect" | "none";

function Letter({ index, actualWord, children }: { index: number; actualWord: string; children: string }) {
  const hasLetter = actualWord.includes(children);
  const state: LetterState = children === " " ? "none" : hasLetter ? (actualWord[index] === children ? "correct" : "close") : "incorrect";

  return (
    <div className={styles.letter} data-state={state}>
      {children}
    </div>
  );
}
