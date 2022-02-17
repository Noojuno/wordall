import useLocalStorage from "use-local-storage";
import { useQueryParam } from "use-query-params";
import { useEffect, useState } from "react";

import { Keyboard } from "./components/Keyboard";
import { Word } from "./components/Word";

import { isEmpty, isLetter, reverse } from "./lib/util";
import { DEFAULT_SETTINGS, WordSettings } from "./lib/words";

import styles from "./App.module.scss";
import { getGuessStatesLetters as getLetterStates } from "./lib/guesses";
import classNames from "classnames";

type Theme = "light" | "dark";

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultDark ? "dark" : "light");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [wordList, setWordList] = useState<string[]>([]);
  const [settings, setSettings] = useState<WordSettings>({ ...DEFAULT_SETTINGS, word: "KNOLL" });
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [settingsQuery] = useQueryParam<string | undefined>("w");

  useEffect(() => {
    if (settingsQuery) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(atob(settingsQuery)) });
    }
  }, [settingsQuery]);

  useEffect(() => {
    if (!settings) return;

    fetch(`/words/en/${settings.word.length}.json`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res[0].length === settings.word.length);

        if (res[0].length === settings.word.length) {
          setWordList(res);
        }
      });
  }, [settings]);

  const solution = settings.word;
  const numGuesses = settings.guesses;
  const hasGuesses = guesses.length < numGuesses;

  const addGuess = (guess: string) => {
    const lowerGuess = guess.toLowerCase();

    if (!wordList.includes(lowerGuess)) {
      // TODO: show error
      console.log("invalid word", lowerGuess);
      return;
    }

    setGuesses((existing) => {
      return [...existing, lowerGuess];
    });

    setCurrentGuess("");
  };

  const onKeyDown = (key: string) => {
    const lowerKey = key.toLowerCase();

    // If already correct don't allow typing
    if (guesses[guesses.length - 1] === solution.toLowerCase()) return;

    if (lowerKey === "←" || lowerKey === "backspace") {
      setCurrentGuess((existing) => {
        const amount = reverse(existing).search(/\S|$/) + 1;

        return existing.slice(0, existing.length - amount);
      });
      return;
    }

    // Submit guess
    if (lowerKey === "enter" && currentGuess.length >= solution.length) {
      addGuess(currentGuess);
      return;
    }

    if (!hasGuesses || !isLetter(lowerKey)) return;

    setCurrentGuess((existing) => {
      // Allows for deleting a letter and filling it in as you go
      if (existing.includes(" ")) {
        return existing.replace(" ", lowerKey);
      }

      return (existing + lowerKey).slice(0, solution.length);
    });
  };

  const filledGuesses = [...guesses, ...Array(Math.max(0, numGuesses - 1 - guesses.length)).fill("")];
  if (hasGuesses) filledGuesses.splice(guesses.length, 0, currentGuess);

  return (
    <div className={styles.app} data-theme={theme} onKeyDown={(e) => onKeyDown(e.key.toLowerCase())} tabIndex={0}>
      <header className={styles.header}>
        <div className={classNames(styles.menu, styles.left)}>
          <button onClick={toggleTheme}>Theme</button>
        </div>
        <div className={styles.title}>
          WORD<em>ALL</em>
        </div>
        <div className={classNames(styles.menu, styles.right)}>Menu</div>
      </header>

      <main className={styles.main}>
        <div className={styles.game}>
          <h2>
            GUESSES: ({guesses.length}/{numGuesses})
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
