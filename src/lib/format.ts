export function formatMoney(amount: number, currency: "USD" | "EUR" | "CUP") {
  try {
    const locale = currency === "CUP" ? "es-CU" : "es-ES";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}