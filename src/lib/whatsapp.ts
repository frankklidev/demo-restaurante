export function buildWhatsAppLink(phoneE164: string, message: string) {
  const cleaned = phoneE164.replace(/[^\d+]/g, "");
  const text = encodeURIComponent(message);
  // wa.me no usa el +
  const waNumber = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  return `https://wa.me/${waNumber}?text=${text}`;
}

export function productWhatsAppMessage(opts: {
  productName: string;
  unit: string;
  priceLabel: string;
  restaurantName: string;
}) {
  const { productName, unit, priceLabel, restaurantName } = opts;
  return `Hola! 👋 Soy cliente de ${restaurantName}.

Quiero pedir:
• ${productName} (${unit})
• Precio: ${priceLabel}

¿Me confirmas disponibilidad y cómo coordinar la entrega/recogida? 🙌`;
}