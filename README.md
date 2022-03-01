# Wordall

Wordall is a clone of Wordle with much more customizability! It is built using React and TypeScript. You can find a hosted version [here](https://wordall.vercel.app/)

## Features
Wordall a few new features, all currently customizable via query parameters. In the future I would like to build a UI to access them. They are: 
* Custom words.
  * You can share a word via the query param `w`
  * It must be a url and base64 encoded word, for example `https://wordall.vercel.app/?w=Ymx1cmI%3D` is the word `BLURB`
* Custom word length
  * The days of 5 letter words are over!
  * You can control the length of the random word via the query param `l`, for example `https://wordall.vercel.app/?l=6` for 6 letter words.
  * 3-12 letter words are supported.
* Total number of guesses.
  * Can be set with the query param `g`, for example `https://wordall.vercel.app/?g=8`.
  * This currently works well on desktop, but the mobile UI has a few issues with the UX of scrolling through guesses.
* Dark and light mode
  * It supports both dark and light mode, and should be set by default according to your system settings

## Development

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
