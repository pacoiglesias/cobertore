'use client';

import React from 'react';
import { CatalogProduct } from '@/lib/types';
import { buildCloudinaryUrl } from '@/lib/cloudinary';

interface ProductSchemaProps {
  product: CatalogProduct;
  lang: string;
}

export function ProductSchema({ product, lang }: ProductSchemaProps) {
  // Manejo directo de las propiedades de CatalogProduct
  const title = product.title || "Cobertor";
  const description = product.desc || "Cobertor térmico al mayoreo";
  const image = product.imgUrl ? buildCloudinaryUrl(product.imgUrl, 900) : "https://cobertores.com/logo-oficial.png";

  // FIX SEO 2026-08-09 (v1): el precio "0.00" era un valor inventado --
  // catálogo B2B por mayoreo sin precio público (se cotiza por volumen) --
  // así que un Offer con price="0.00" le decía a Google que es gratis.
  //
  // FIX SEO 2026-08-10 (v2): la v1 reemplazó el price="0.00" por un
  // "priceSpecification" sin valor -- pero Google Search Console marcó
  // eso como "elemento no válido" en Fragmentos de producto Y Fichas de
  // comerciante (4 de cada uno). Motivo confirmado contra la documentación
  // oficial de Google (developers.google.com/search/docs/appearance/
  // structured-data/product-snippet): CUALQUIER "offers" que se declare
  // debe incluir "price" (o "lowPrice"/"highPrice") Y "priceCurrency" --
  // no existe un valor "sin precio" válido dentro de un Offer/AggregateOffer.
  // La propia documentación de Google muestra como alternativa VÁLIDA un
  // Product SIN NINGÚN "offers" (solo name/image/description/brand, o con
  // review/aggregateRating) cuando no hay precio público que mostrar --
  // el producto pierde elegibilidad para Fragmentos de producto/Fichas de
  // comerciante (que sí exigen precio), pero no genera ningún error, y
  // sigue siendo válido para lo demás (Organización, Empresa local, que
  // ya funcionaban bien). Por eso aquí se quita "offers" por completo en
  // vez de inventar un precio o un rango que no existe.
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": title,
    "image": image,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "Mano Fil"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
