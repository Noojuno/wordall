import useLocalStorage from "use-local-storage";
import { Keyboard } from "./components/Keyboard";

import styles from "./App.module.scss";
import { Word } from "./components/Word";
import { useState } from "react";

type Theme = "light" | "dark";

const actualWord = "KNOLL";
const NUM_GUESSES = 6;

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultDark ? "dark" : "light");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const hasGuesses = guesses.length < NUM_GUESSES;

  const addGuess = (guess: string) => {
    setGuesses((existing) => {
      return [...existing, guess.toLowerCase()];
    });
  };

  const onKey = (key: string) => {
    console.log(key);

    if (key === "←" || key === "backspace") {
      setCurrentGuess((existing) => {
        return existing.slice(0, existing.length - 1);
      });
      return;
    }

    if (key === "enter" && currentGuess.length >= actualWord.length) {
      addGuess(currentGuess);
      setCurrentGuess("");
      return;
    }

    if (key.length > 1 || key.length < 1 || !hasGuesses) return;

    setCurrentGuess((existing) => {
      if (existing.length + 1 > actualWord.length) return existing;

      return existing + key;
    });
  };

  const guessedLetters = guesses
    .flatMap((g) => g.split(""))
    .filter((g, i, s) => {
      return s.indexOf(g) === i;
    });

  let filledGuesses = [...guesses, ...Array(Math.max(0, NUM_GUESSES - 1 - guesses.length)).fill("")];
  if (hasGuesses) filledGuesses.splice(guesses.length, 0, currentGuess);

  return (
    <div className={styles.app} data-theme={theme} onKeyDown={(e) => onKey(e.key.toLowerCase())}>
      <header className={styles.header}>
        <div className={styles.menu}>
          <button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            Theme
          </button>
        </div>
        <div className={styles.title}>
          Word<em>all</em>
        </div>
        <div className={styles.menu}>Menu</div>
      </header>

      <main className={styles.main}>
        <div className={styles.game}>
          <h2>{actualWord}</h2>

          <div className={styles.words}>
            {filledGuesses.map((guess, i) => {
              return <Word key={i} solution={actualWord.toLowerCase()} word={guess} revealed={i !== guesses.length && guess !== ""} />;
            })}
          </div>
          <Keyboard guessedLetters={guessedLetters} className={styles.keyboard} onPressKey={onKey} />
        </div>
      </main>
    </div>
  );
}

export default App;
