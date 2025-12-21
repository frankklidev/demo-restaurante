type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-peppino-dark/20 bg-white px-5 py-3">
      {/* Icon */}
      <span className="text-lg text-peppino-dark/60">🔍</span>

      {/* Input */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre, categoría u origen..."
        className="w-full bg-transparent text-base text-peppino-dark outline-none placeholder:text-peppino-dark/50"
      />

      {/* Clear */}
      {value ? (
        <button
          onClick={() => onChange("")}
          className="rounded-full bg-peppino-light px-3 py-1 text-sm font-bold text-peppino-dark border border-peppino-dark/20 hover:opacity-90"
        >
          Limpiar
        </button>
      ) : null}
    </div>
  );
}