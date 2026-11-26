// Ejecuta una acción asíncrona con estado "ocupado" y avisos de éxito o error.
import { useCallback, useState } from "react";
import { friendlyError } from "../lib/errors.js";
import { useToast } from "../state/ToastProvider.jsx";

export function useAction() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (fn, successMessage) => {
    setBusy(true);
    try {
      await fn();
      if (successMessage) toast(successMessage);
      return true;
    } catch (e) {
      console.error(e);
      toast(friendlyError(e));
      return false;
    } finally {
      setBusy(false);
    }
  }, [toast]);
  return { run, busy };
}
