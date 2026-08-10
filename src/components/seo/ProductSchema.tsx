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

  // FIX SEO 2026-08-09: el precio "0.00" era un valor inventado -- este es
  // un catálogo B2B por mayoreo sin precio público (se cotiza por volumen),
  // así que declarar un Offer con price="0.00" le dice literalmente a
  // Google que el producto es gratis. Eso puede generar errores de "precio
  // inválido" en Search Console / Merchant Center y, en el peor caso, un
  // rich result engañoso -- ambos dañan la confianza del listado, que es
  // justo lo contrario de lo que se busca al mejorar el ranking. Se
  // reemplaza por un "priceSpecification" sin valor fijo (patrón que
  // Google documenta para "precio bajo cotización"), sin declarar un
  // price/highPrice inventado.
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": title,
    "image": image,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "Mano Fil"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "MXN",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "MXN",
        "valueAddedTaxIncluded": false,
        "description": "Precio sujeto a cotización por volumen (venta B2B por mayoreo)"
      },
      "availability": "https://schema.org/InStock",
      "url": "https://cobertores.com/es/#productos",
      "seller": {
        "@type": "Organization",
        "name": "Mano Fil S.A."
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
