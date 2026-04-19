import { STACKS_MAINNET } from "@stacks/network";
import {
  PostConditionMode,
  cvToValue,
  hexToCV,
  principalCV,
  uintCV,
  serializeCV,
} from "@stacks/transactions";
import type {
  NumberGuessConfig,
  LeaderEntry,
  ReadOnlyResponse,
  GuessCall,
} from "./types";

export const DEFAULT_CONFIG: Required<NumberGuessConfig> = {
  contractAddress: "SP1Q7YR67R6WGP28NXDJD1WZ11REPAAXRJJ3V6RKM",
  contractName: "number-guess",
  apiBase: "https://api.mainnet.hiro.so",
  network: STACKS_MAINNET,
};

function resolveConfig(overrides: NumberGuessConfig = {}): Required<NumberGuessConfig> {
  return { ...DEFAULT_CONFIG, ...overrides };
}

function serializeCvToHex(cv: unknown): string {
  const serialized = serializeCV(cv as never);
  if (typeof serialized === "string") {
    return serialized.startsWith("0x") ? serialized : `0x${serialized}`;
  }
  return `0x${Buffer.from(serialized).toString("hex")}`;
}

export async function callReadOnly(
  functionName: string,
  args: string[] = [],
  config: NumberGuessConfig = {}
): Promise<ReadOnlyResponse> {
  const resolved = resolveConfig(config);
  const response = await fetch(
    `${resolved.apiBase}/v2/contracts/call-read/${resolved.contractAddress}/${resolved.contractName}/${functionName}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: resolved.contractAddress,
        arguments: args,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Read-only call failed with status ${response.status}`);
  }

  return response.json() as Promise<ReadOnlyResponse>;
}

export async function getTotalGuesses(config: NumberGuessConfig = {}): Promise<number> {
  const data = await callReadOnly("get-total-guesses", [], config);
  if (!data.okay || !data.result) return 0;
  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true) as { value?: unknown } | unknown;
  return Number(parsed && typeof parsed === "object" && "value" in parsed ? parsed.value ?? 0 : parsed ?? 0);
}

export async function getTotalWins(config: NumberGuessConfig = {}): Promise<number> {
  const data = await callReadOnly("get-total-wins", [], config);
  if (!data.okay || !data.result) return 0;
  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true) as { value?: unknown } | unknown;
  return Number(parsed && typeof parsed === "object" && "value" in parsed ? parsed.value ?? 0 : parsed ?? 0);
}

export async function getUserGuesses(userAddress: string, config: NumberGuessConfig = {}): Promise<number> {
  const principalArg = serializeCvToHex(principalCV(userAddress));
  const data = await callReadOnly("get-user-guesses", [principalArg], config);
  if (!data.okay || !data.result) return 0;
  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true) as { value?: unknown } | unknown;
  return Number(parsed && typeof parsed === "object" && "value" in parsed ? parsed.value ?? 0 : parsed ?? 0);
}

export async function getUserWins(userAddress: string, config: NumberGuessConfig = {}): Promise<number> {
  const principalArg = serializeCvToHex(principalCV(userAddress));
  const data = await callReadOnly("get-user-wins", [principalArg], config);
  if (!data.okay || !data.result) return 0;
  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true) as { value?: unknown } | unknown;
  return Number(parsed && typeof parsed === "object" && "value" in parsed ? parsed.value ?? 0 : parsed ?? 0);
}

export function createGuessCall(value: number, config: NumberGuessConfig = {}): GuessCall {
  const resolved = resolveConfig(config);
  return {
    contractAddress: resolved.contractAddress,
    contractName: resolved.contractName,
    functionName: "guess",
    functionArgs: [uintCV(value)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    network: resolved.network,
  };
}

export class NumberGuessClient {
  private readonly config: Required<NumberGuessConfig>;

  constructor(config: NumberGuessConfig = {}) {
    this.config = resolveConfig(config);
  }

  getTotalGuesses(): Promise<number> { return getTotalGuesses(this.config); }
  getTotalWins(): Promise<number> { return getTotalWins(this.config); }
  getUserGuesses(addr: string): Promise<number> { return getUserGuesses(addr, this.config); }
  getUserWins(addr: string): Promise<number> { return getUserWins(addr, this.config); }
  createGuessCall(value: number): GuessCall { return createGuessCall(value, this.config); }
}
