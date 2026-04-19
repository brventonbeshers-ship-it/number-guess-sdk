[![npm](https://img.shields.io/npm/v/number-guess-sdk?color=blueviolet)](https://www.npmjs.com/package/number-guess-sdk) ![Stacks Mainnet](https://img.shields.io/badge/Stacks-Mainnet-blueviolet) ![license](https://img.shields.io/badge/license-MIT-blue)

# number-guess-sdk

TypeScript SDK for interacting with the Number Guess contract on Stacks.

## Installation

```bash
npm install number-guess-sdk
```

## Usage

```ts
import { getTotalGuesses, getTotalWins, createGuessCall } from "number-guess-sdk";

const total = await getTotalGuesses();
const wins = await getTotalWins();
const tx = createGuessCall(42);
```

## License

MIT
