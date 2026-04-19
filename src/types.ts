import type { StacksNetwork } from "@stacks/network";
import type { PostConditionMode } from "@stacks/transactions";

export interface NumberGuessConfig {
  contractAddress?: string;
  contractName?: string;
  apiBase?: string;
  network?: StacksNetwork;
}

export interface LeaderEntry {
  who: string;
  wins: number;
}

export interface ReadOnlyResponse {
  okay?: boolean;
  result?: string;
  cause?: string;
}

export interface GuessCall {
  contractAddress: string;
  contractName: string;
  functionName: "guess";
  functionArgs: unknown[];
  postConditionMode: PostConditionMode;
  postConditions: [];
  network: StacksNetwork;
}
