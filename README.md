# Vue Snake Game

## Getting Started

Run

```sh
yarn install
yarn dev
```

and visit [localhost:3000](http://localhost:3000) to play the game!

## Building the Game

Run `yarn build` to build the game to the `dist`-folder.

To use it on another website, include the generated `dist/_assets` files (`index.js` and `style.css`), add the images under `dist/snake` to your public folder, so that they are reachable under `/snake/xy.svg`, and add a `<div id="app" />` somewhere on your page.
