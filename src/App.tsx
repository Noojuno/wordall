import useLocalStorage from "use-local-storage";
import { useQueryParam } from "use-query-params";
import { useEffect, useState } from "react";

import { Keyboard } from "./components/Keyboard";
import { Word } from "./components/Word";

import { isEmpty, isLetter } from "./lib/util";
import { DEFAULT_SETTINGS, WordSettings } from "./lib/words";

import styles from "./App.module.scss";
import { getGuessStatesLetters as getLetterStates } from "./lib/guesses";

type Theme = "light" | "dark";

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultDark ? "dark" : "light");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [wordList, setWordList] = useState<string[]>();
  const [settings, setSettings] = useState<WordSettings>({ ...DEFAULT_SETTINGS, word: "KNOLL" });
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [settingsQuery] = useQueryParam<string | undefined>("w");

  useEffect(() => {
    if (settingsQuery) {
      setSettings(JSON.parse(atob(settingsQuery)));
    }
  }, [settingsQuery]);

  useEffect(() => {
    if (!settings) return;

    fetch(`/words/en/${settings.word.length}.json`)
      .then((res) => res.json())
      .then((res) => setWordList(res));
  }, [settings]);

  const solution = settings.word;
  const numGuesses = settings.guesses;
  const hasGuesses = guesses.length < numGuesses;

  const addGuess = (guess: string) => {
    setGuesses((existing) => {
      return [...existing, guess.toLowerCase()];
    });
  };

  const onKeyDown = (key: string) => {
    if (key === "←" || key === "backspace") {
      setCurrentGuess((existing) => {
        return existing.slice(0, existing.length - 1);
      });
      return;
    }

    if (key === "enter" && currentGuess.length >= solution.length) {
      addGuess(currentGuess);
      setCurrentGuess("");
      return;
    }

    if (!hasGuesses || !isLetter(key)) return;

    setCurrentGuess((existing) => {
      return (existing + key).slice(0, solution.length);
    });
  };

  const filledGuesses = [...guesses, ...Array(Math.max(0, numGuesses - 1 - guesses.length)).fill("")];
  if (hasGuesses) filledGuesses.splice(guesses.length, 0, currentGuess);

  return (
    <div className={styles.app} data-theme={theme} onKeyDown={(e) => onKeyDown(e.key.toLowerCase())} tabIndex={0}>
      <header className={styles.header}>
        <div className={styles.menu}>
          <button onClick={toggleTheme}>Theme</button>
        </div>
        <div className={styles.title}>
          Word<em>all</em>
        </div>
        <div className={styles.menu}>Menu</div>
      </header>

      <main className={styles.main}>
        <div className={styles.game}>
          <h2>
            ({guesses.length}/{numGuesses})
          </h2>

          <div className={styles.words}>
            {filledGuesses.map((guess, i) => {
              const revealed = i !== guesses.length && isEmpty(guess);

              return <Word key={i} solution={solution.toLowerCase()} word={guess} revealed={revealed} />;
            })}
          </div>
          <Keyboard className={styles.keyboard} letterStates={getLetterStates(solution, guesses)} onPressKey={onKeyDown} />
        </div>
      </main>
    </div>
  );
}

export default App;
