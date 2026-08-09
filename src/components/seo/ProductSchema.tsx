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
    // Oferta B2B por mayoreo
    "offers": {
      "@type": "Offer",
      "priceCurrency": "MXN",
      "price": "0.00",
      "availability": "https://schema.org/InStock",
      "url": "https://cobertores.com/es#productos",
      "priceValidUntil": "2027-12-31",
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
