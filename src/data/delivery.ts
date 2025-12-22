export type Municipio = {
  id: string;
  name: string;
  fee: number; // costo del viaje
};

// ✅ Ejemplo (La Habana). Ajusta a tu provincia/zonas y precios reales.
export const MUNICIPIOS: Municipio[] = [
  { id: "habana-vieja", name: "Habana Vieja", fee: 2.5 },
  { id: "centro-habana", name: "Centro Habana", fee: 2.5 },
  { id: "plaza", name: "Plaza de la Revolución", fee: 3.0 },
  { id: "cerro", name: "Cerro", fee: 3.0 },
  { id: "10-octubre", name: "10 de Octubre", fee: 3.5 },
  { id: "boyeros", name: "Boyeros", fee: 4.5 },
  { id: "arroyo-naranjo", name: "Arroyo Naranjo", fee: 4.0 },
  { id: "san-miguel", name: "San Miguel del Padrón", fee: 4.0 },
  { id: "guanabacoa", name: "Guanabacoa", fee: 4.5 },
  { id: "regla", name: "Regla", fee: 4.0 },
  { id: "playa", name: "Playa", fee: 4.0 },
  { id: "marianao", name: "Marianao", fee: 4.0 },
  { id: "la-lisa", name: "La Lisa", fee: 4.5 },
];