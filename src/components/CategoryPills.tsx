import type { Category } from "../types/catalog";

type Props = {
  categories: readonly Category[];
  value: Category | "Todas";
  onChange: (v: Category | "Todas") => void;
};

export default function CategoryPills({ categories, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Todas */}
      <button
        onClick={() => onChange("Todas")}
        className={[
          "rounded-full px-5 py-2.5 text-sm font-bold transition border",
          value === "Todas"
            ? "bg-peppino-dark text-peppino-cream border-peppino-dark"
            : "bg-white text-peppino-dark border-peppino-dark/20 hover:bg-peppino-light/60",
        ].join(" ")}
      >
        Todas
      </button>

      {/* Categorías */}
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={[
            "rounded-full px-5 py-2.5 text-sm font-bold transition border",
            value === c
              ? "bg-peppino-dark text-peppino-cream border-peppino-dark"
              : "bg-white text-peppino-dark border-peppino-dark/20 hover:bg-peppino-light/60",
          ].join(" ")}
        >
          {c}
        </button>
      ))}
    </div>
  );
}