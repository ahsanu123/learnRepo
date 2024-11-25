import { Transaction } from "prosemirror-state";

export type DispatchCallback = ((tr: Transaction) => void) | undefined;
