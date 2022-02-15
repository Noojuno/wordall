import useLocalStorage from "use-local-storage";
import { Keyboard } from "./components/Keyboard";

import styles from "./App.module.scss";

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  return (
    <div className={styles.app} data-theme={theme}>
      <header className={styles.header}>
        <div className={styles.menu}>Wordall</div>
        <div className={styles.title}>Wordall</div>
        <div className={styles.menu}>Wordall</div>
      </header>

      <main className={styles.main}>
        <Keyboard></Keyboard>
      </main>
    </div>
  );
}

export default App;
