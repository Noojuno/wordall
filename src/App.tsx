import useLocalStorage from "use-local-storage";
import { NumberParam, QueryParamConfigMap, StringParam, useQueryParams, withDefault } from "use-query-params";
import { useEffect, useState, useContext } from "react";

import { getRandom, isLetter, reverse } from "./lib/util";
import { DEFAULT_SETTINGS, WordSettings } from "./lib/words";

import styles from "./App.module.scss";
import classNames from "classnames";
import { GameBoard } from "./components/GameBoard";
import { ToastMessage } from "./components/ToastMessage";
import { ToastContext } from "./lib/toast";
import { Button } from "./components/Button";

type Theme = "light" | "dark";

const QUERY_PARAMS_CONFIG: QueryParamConfigMap = {
  w: withDefault(StringParam, null),
  g: withDefault(NumberParam, null),
  l: withDefault(NumberParam, null),
};

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultDark ? "dark" : "light");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [wordList, setWordList] = useState<string[]>([]);
  const [settings, setSettings] = useState<WordSettings>();
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [queryParams, setQueryParams] = useQueryParams(QUERY_PARAMS_CONFIG);
  const toast = useContext(ToastContext);

  const hasWon = settings && guesses[guesses.length - 1] === settings.word?.toLowerCase();

  const updateWordList = async (length: number, updateWord: boolean) => {
    const words: string[] = await fetch(`/words/en/${length}.json`)
      .then((res) => res.json())
      .then((res) => {
        if (res[0].length === length) {
          setWordList(res);
        }

        return res;
      });

    if (updateWord) {
      resetWord(words);
    }
  };

  const resetWord = (words: string[] = wordList) => {
    setGuesses([]);
    setCurrentGuess("");

    const word = getRandom(words);

    setSettings((s) => {
      return s ? { ...s, word } : s;
    });

    setQueryParams({ w: btoa(encodeURIComponent(word)), l: undefined });
  };

  useEffect(() => {
    if (queryParams) {
      const word: string | undefined = queryParams.w ? atob(decodeURIComponent(queryParams.w)) : undefined;
      const length: number = word ? word.length : queryParams.l || DEFAULT_SETTINGS.length;
      const guessCount: number = queryParams.g || DEFAULT_SETTINGS.guessCount;

      setSettings({ ...DEFAULT_SETTINGS, random: false, word, length, guessCount });
      return;
    }

    setSettings(DEFAULT_SETTINGS);
  }, [queryParams]);

  useEffect(() => {
    if (!settings) return;

    const { length, word } = settings;

    if (!wordList || wordList.length <= 0) updateWordList(length, !word || word.length !== length);
  }, [settings, wordList]);

  const addGuess = (guess: string) => {
    const lowerGuess = guess.toLowerCase();

    if (!settings) return;

    toast?.clear();

    if (!wordList.includes(lowerGuess) && lowerGuess !== settings.word) {
      // TODO: show error
      toast?.show(`${lowerGuess.toUpperCase()} is not in our dictionary!`, 2);
      return;
    }

    if (guesses.length + 1 >= settings.guessCount) {
      console.log("word was", settings.word);
    }

    setGuesses((existing) => {
      return [...existing, lowerGuess];
    });

    setCurrentGuess("");
  };

  const onKeyDown = (k: string) => {
    const key = k.toLowerCase();

    if (!settings) return;

    // If already correct don't allow typing
    if (hasWon) return;

    if (key === "←" || key === "backspace") {
      setCurrentGuess((existing) => {
        const amount = reverse(existing).search(/\S|$/) + 1;

        return existing.slice(0, existing.length - amount);
      });

      return;
    }

    // Submit guess
    if (key === "enter" && currentGuess.length >= settings.length) {
      addGuess(currentGuess);
      return;
    }

    if (guesses.length >= settings.guessCount || !isLetter(key)) return;

    setCurrentGuess((existing) => {
      // Allows for deleting a letter and filling it in as you go
      if (existing.includes(" ")) {
        return existing.replace(" ", key);
      }

      return (existing + key).slice(0, settings.length);
    });
  };

  return (
    <div className={styles.app} data-theme={theme} onKeyDown={(e) => onKeyDown(e.key.toLowerCase())} tabIndex={0}>
      <header className={styles.header}>
        <div className={classNames(styles.menu, styles.left)}>
          <Button onClick={toggleTheme}>Toggle Theme</Button>
        </div>
        <div className={styles.title}>
          WORD<em>ALL</em>
        </div>
        <div className={classNames(styles.menu, styles.right)}>
          <Button
            onClick={() => {
              toast?.show("Generated new random word!");
              resetWord();
            }}
          >
            New Word
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        {settings && settings.word && (
          <GameBoard settings={settings} currentGuess={currentGuess} solution={settings.word} guesses={guesses} onKeyDown={onKeyDown} />
        )}
      </main>

      <ToastMessage />
    </div>
  );
}

export default App;
