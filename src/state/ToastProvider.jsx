import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(() => {});
const TOAST_MS = 3800;

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const timer = useRef(null);
  const toast = useCallback(text => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), TOAST_MS);
  }, []);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      {message && <div className="toast" role="status">{message}</div>}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
