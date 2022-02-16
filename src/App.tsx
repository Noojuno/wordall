import useLocalStorage from "use-local-storage";
import { Keyboard } from "./components/Keyboard";

import styles from "./App.module.scss";
import { Word } from "./components/Word";

type Theme = "light" | "dark";

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultDark ? "dark" : "light");

  return (
    <div className={styles.app} data-theme={theme}>
      <header className={styles.header}>
        <div className={styles.menu}>Wordall</div>
        <div className={styles.title}>Wordall</div>
        <div className={styles.menu}>Wordall</div>
      </header>

      <main className={styles.main}>
        <div className={styles.game}>
          <div className={styles.words}>
            <Word>CLEAR</Word>
            <Word>RATES</Word>
            <Word>RATES</Word>
            <Word></Word>
            <Word></Word>
            <Word></Word>
          </div>
          <Keyboard className={styles.keyboard}></Keyboard>
        </div>
      </main>
    </div>
  );
}

export default App;
