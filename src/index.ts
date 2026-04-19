import type { NumberGuessClient } from "./client";

export {
  NumberGuessClient,
  DEFAULT_CONFIG,
  callReadOnly,
  createGuessCall,
  getTotalGuesses,
  getTotalWins,
  getUserGuesses,
  getUserWins,
} from "./client";

export type {
  NumberGuessConfig,
  LeaderEntry,
  ReadOnlyResponse,
  GuessCall,
} from "./types";

export type TotalGuessesResult = Awaited<ReturnType<NumberGuessClient["getTotalGuesses"]>>;
