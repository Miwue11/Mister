// Campo de importe: deja escribir libre y pone los puntos de miles al salir.
import { formatMoney, parseAmount } from "../lib/format.js";

export function MoneyInput({ id, label, value, onChange, placeholder }) {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={e => e.target.value.trim() && onChange(formatMoney(parseAmount(e.target.value)))}
      />
    </div>
  );
}
