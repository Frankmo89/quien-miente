/**
 * Configuración de la tienda para la app móvil
 * Los packs se definen localmente (offline-first) con IDs de RevenueCat
 */

export type PackMode = "familiar" | "adultos" | "both";

export interface GamePack {
  id: string;
  name: string;
  description: string;
  price: number; // Precio en USD (ej: 2.99)
  mode: PackMode;
  revenueCatId: string;
  isFree: boolean;
}

/**
 * Packs disponibles offline
 * Estos se sincronizan con RevenueCat para verificar compras
 */
export const OFFLINE_PACKS: GamePack[] = [
  // Pack Gratuito
  {
    id: "romper-hielo",
    name: "Para Romper el Hielo",
    description: "40 preguntas situacionales para empezar a jugar",
    price: 0,
    mode: "both",
    revenueCatId: "",
    isFree: true,
  },
  // Packs Premium
  {
    id: "salseo-total",
    name: "Salseo Total",
    description: "Preguntas atrevidas para grupos con mucha confianza",
    price: 2.99,
    mode: "adultos",
    revenueCatId: "qm_pack_salseo_299",
    isFree: false,
  },
  {
    id: "dilemas-morales",
    name: "Dilemas Morales",
    description: "Escenarios hipotéticos que exploran tu forma de pensar",
    price: 2.99,
    mode: "both",
    revenueCatId: "qm_pack_dilemas_299",
    isFree: false,
  },
  {
    id: "recuerdos-infancia",
    name: "Recuerdos de la Infancia",
    description: "Anécdotas y vivencias de cuando erais niños",
    price: 2.99,
    mode: "familiar",
    revenueCatId: "qm_pack_infancia_299",
    isFree: false,
  },
  {
    id: "historias-viaje",
    name: "Historias de Viaje",
    description: "Aventuras, desastres y descubrimientos en tus viajes",
    price: 2.99,
    mode: "both",
    revenueCatId: "qm_pack_viajes_299",
    isFree: false,
  },
];

/**
 * Helpers
 */
export const getFreePacks = () => OFFLINE_PACKS.filter((p) => p.isFree);
export const getPremiumPacks = () => OFFLINE_PACKS.filter((p) => !p.isFree);
export const getPackById = (id: string) => OFFLINE_PACKS.find((p) => p.id === id);
