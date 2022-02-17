import useLocalStorage from "use-local-storage";
import { useQueryParam } from "use-query-params";
import { useEffect, useState } from "react";

import { getRandom, isEmpty, isLetter, reverse } from "./lib/util";
import { DEFAULT_SETTINGS, WordSettings } from "./lib/words";

import styles from "./App.module.scss";
import classNames from "classnames";
import { GameBoard } from "./components/GameBoard";

type Theme = "light" | "dark";

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultDark ? "dark" : "light");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [wordList, setWordList] = useState<string[]>([]);
  const [settings, setSettings] = useState<WordSettings>({ ...DEFAULT_SETTINGS });
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [settingsQuery] = useQueryParam<string | undefined>("w");

  useEffect(() => {
    if (settingsQuery) {
      let settings: WordSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(atob(settingsQuery)) };
      if (settings.word) settings.length = settings.word.length;

      setSettings(settings);
    }
  }, [settingsQuery]);

  useEffect(() => {
    if (!settings) return;

    fetch(`/words/en/${settings.length}.json`)
      .then((res) => res.json())
      .then((res) => {
        if (res[0].length === settings.length) {
          if (!settings.word) {
            setSettings((s) => {
              return { ...s, word: getRandom(res) };
            });
          }

          setWordList(res);
        }
      });
  }, [settings]);

  const solution = settings.word;
  const numGuesses = settings.guessCount;

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
    if (guesses[guesses.length - 1] === solution?.toLowerCase()) return;

    if (lowerKey === "←" || lowerKey === "backspace") {
      setCurrentGuess((existing) => {
        const amount = reverse(existing).search(/\S|$/) + 1;

        return existing.slice(0, existing.length - amount);
      });
      return;
    }

    // Submit guess
    if (lowerKey === "enter" && currentGuess.length >= settings.length) {
      addGuess(currentGuess);
      return;
    }

    if (guesses.length >= settings.guessCount || !isLetter(lowerKey)) return;

    setCurrentGuess((existing) => {
      // Allows for deleting a letter and filling it in as you go
      if (existing.includes(" ")) {
        return existing.replace(" ", lowerKey);
      }

      return (existing + lowerKey).slice(0, settings.length);
    });
  };

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
        {solution && <GameBoard settings={settings} currentGuess={currentGuess} solution={solution} guesses={guesses} onKeyDown={onKeyDown} />}
      </main>
    </div>
  );
}

export default App;
