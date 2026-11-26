import { memberFinance } from "../lib/finance.js";
import { useLiga } from "../state/LigaProvider.jsx";

export function useFinance(member) {
  const { mister, mapa } = useLiga();
  return memberFinance(member, mister, mapa);
}
