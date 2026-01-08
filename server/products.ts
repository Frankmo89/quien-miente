/**
 * Stripe products configuration for question packs
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  stripePriceId?: string; // Will be set after creating in Stripe
}

export const PRODUCTS: Record<string, Product> = {
  "salseo-total": {
    id: "salseo-total",
    name: "Salseo Total",
    description: "Preguntas atrevidas para grupos con mucha confianza",
    price: 299, // $2.99
  },
  "dilemas-morales": {
    id: "dilemas-morales",
    name: "Dilemas Morales",
    description: "Escenarios hipotéticos que exploran tu forma de pensar",
    price: 299, // $2.99
  },
  "recuerdos-infancia": {
    id: "recuerdos-infancia",
    name: "Recuerdos de la Infancia",
    description: "Anécdotas y vivencias de cuando erais niños",
    price: 299, // $2.99
  },
  "historias-viaje": {
    id: "historias-viaje",
    name: "Historias de Viaje",
    description: "Aventuras, desastres y descubrimientos en tus viajes",
    price: 299, // $2.99
  },
};

export function getProductById(productId: string): Product | undefined {
  return PRODUCTS[productId];
}
