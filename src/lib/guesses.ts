export type LetterState = "correct" | "present" | "incorrect" | "none";

export const getGuessStates = (solution: string, guess: string): LetterState[] => {
  const splitSolution = solution.toLowerCase().split("");
  const splitGuess = guess.toLowerCase().split("");

  const solutionCharsTaken = splitSolution.map((_) => false);

  const statuses: LetterState[] = Array.from(Array(guess.length));

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = "correct";
      solutionCharsTaken[i] = true;
      return;
    }
  });

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return;

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = "incorrect";
      return;
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex((x, index) => x === letter && !solutionCharsTaken[index]);

    if (indexOfPresentChar > -1) {
      statuses[i] = "present";
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    } else {
      statuses[i] = "incorrect";
      return;
    }
  });

  return statuses;
};

const stateOrder: LetterState[] = ["correct", "present", "incorrect", "none"];

export type LetterStateDict = { [letter: string]: LetterState };
export const getGuessStatesLetters = (solution: string, guesses: string[]): LetterStateDict => {
  const states: LetterStateDict = {};

  for (const guess of guesses) {
    const guessStates = getGuessStates(solution, guess);

    for (let i = 0; i < guessStates.length; i++) {
      const letter = guess[i].toLowerCase();
      const state = guessStates[i];

      if (!states[letter] || stateOrder.indexOf(states[letter]) >= stateOrder.indexOf(state)) {
        states[letter] = state;
      }
    }
  }

  return states;
};
