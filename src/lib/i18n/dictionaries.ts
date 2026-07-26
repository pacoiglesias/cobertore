export type Lang = 'es' | 'en';

export const dictionaries = {
  es: {
    nav: { home: 'Inicio', catalog: 'Catálogo', divisions: 'Divisiones', legacy: 'Legado', portal: 'Portal Privado' },
    hero: {
      since: 'Fábrica de Cobijas y Cobertores • Desde 1962',
      title1: 'Cobertores Térmicos.',
      title2: 'Venta por Mayoreo.',
      desc: 'Infraestructura textil de alto rendimiento. En Mano Fil S.A. somos la fábrica líder en Tlaxcala suministrando cobijas, cobertores y tilmas a escala corporativa con precios directos de fábrica.',
      btnCatalog: 'Ver Catálogo',
      btnMore: 'Nuestra Trayectoria'
    },
    products: {
      tag: 'Línea Industrial',
      title: 'Máximo Rendimiento Textil',
      desc: 'Nuestros productos están diseñados con estrictos controles de calidad para garantizar durabilidad extrema y retención térmica superior en aplicaciones de alto volumen.',
      disclaimer1: '* Los colores y las medidas pueden variar un 5%.',
      disclaimer2: '** 100% regenerado es debido a que son fibras recicladas (mezcla de acrílico, lana, poliéster y otras fibras).',
      measures: 'Especificaciones',
      composition: 'Material',
      quote: 'Cotizar Volumen',
      items: [
        { title: "Tilma Económica", weight: "1.300 KG", img: "/products/tilma-eco-1-3kg.webp", desc: "Tejido compacto y duradero. Soporta uso industrial y lavados constantes." },
        { title: "Manta Térmica", weight: "2.000 KG", img: "/products/manta-eco-2kg.webp", desc: "Aislamiento térmico de grado superior. El mayor gramaje del catálogo." },
        { title: "Tilma Ribeteada", weight: "1.150 KG", img: "/products/tilma-ribeteada.webp", desc: "Acabados reforzados por ultrasonido perimetral. Vida útil prolongada." },
        { title: "Tilma Ligera", weight: "1.000 KG", img: "/products/tilma-eco-1kg.webp", desc: "Optimización de peso y volumen. Perfecta para distribución ágil." }
      ]
    },
    divisions: {
      textileTitle: 'División de Suministro Textil',
      textileDesc: 'Operamos una robusta red logística apoyados en grandes alianzas estratégicas. Capacidad de respuesta inmediata para pedidos de volumen masivo a nivel nacional e internacional.',
      textileBtn: 'Sector Textil',
      realEstateTitle: 'Desarrollo Inmobiliario',
      realEstateDesc: 'Proyectamos y comercializamos parques industriales, naves logísticas y complejos comerciales con estándares de nivel internacional.',
      realEstateBtn: 'Sector Inmobiliario'
    },
    history: {
      tag: 'Legado Corporativo',
      title1: 'Liderazgo Absoluto.',
      title2: 'Forjando el futuro.',
      p1: 'Fundada en <strong class="text-white font-medium">1962</strong>, Mano Fil S.A. nació con una vocación inquebrantable: consolidar alianzas para el suministro masivo. Desde nuestra sede corporativa en <strong class="text-amber-500 font-bold">Santa Ana Chiautempan, Tlaxcala</strong>, y operando a través de nuestro dominio insignia <em class="text-amber-500/80 not-italic font-serif">cobertores.com</em>, hemos perfeccionado el arte de la logística a gran escala, entregando resultados impecables a nivel nacional.',
      p2: 'La eficiencia comercial es nuestra directriz. Esta disciplina nos permitió diversificar nuestro portafolio y, hace <strong class="text-white font-medium">8 años</strong>, incursionar con éxito en el sector inmobiliario y de bienes raíces. Hoy en día, combinamos nuestra profunda experiencia logística con el desarrollo de proyectos que impulsan el crecimiento económico.',
      stat1: 'Año de Fundación',
      stat2: 'Años en Sector Inmobiliario',
      badgeTitle: 'Prestigio Logístico',
      badgeDesc: 'Más de 6 décadas<br/>de excelencia y resultados corporativos.'
    },
    footer: {
      desc: 'Mano Fil S.A. - Transformando materias primas en soluciones de confort e infraestructura global.',
      locations: 'Sedes Operativas',
      tlaxcala: '<strong class="text-white font-medium">Centro de Distribución Tlaxcala</strong><br/>Calle El Grullo, Santa Ana Chiautempan 90800, Tlaxcala, México',
      cdmx: '<strong class="text-white font-medium">Oficinas Comerciales CDMX</strong><br/>San Borja 613 Int. 702, Col. Del Valle Sur, C.P. 03104',
      divs: 'Sectores',
      d1: 'División Manufactura Textil',
      d2: 'División Inmobiliaria y Construcción',
      d3: 'Gestión Comercial',
      intra: 'Plataforma Segura',
      i1: 'Intranet Corporativa',
      i2: 'Políticas de Privacidad',
      i3: 'Términos Legales',
      i4: 'Política de Cookies',
      rights: 'Todos los derechos reservados.',
      design: 'Sistema Segurizado'
    },
    pillars: {
      title: 'Pilares de Nuestra Operación',
      c1_title: 'Respuesta a Contingencias',
      c1_desc: 'Nuestros productos son vitales durante emergencias (heladas, inundaciones, sismos). Garantizamos un servicio oportuno cuando más se necesita.',
      c2_title: 'Suministro de Alto Volumen',
      c2_desc: 'Respaldados por alianzas estratégicas de alto nivel, contamos con la capacidad para surtir cantidades masivas en tiempos de entrega extraordinariamente cortos.',
      c3_title: 'Compromiso Logístico',
      c3_desc: 'Nuestra prioridad es la eficiencia comercial: cumplir con la entrega exacta y brindar un servicio y atención insuperable.'
    },
    dev: 'Sistema Seguro - Conexión Cifrada',
    wip: 'Módulo en mantenimiento'
  },
  en: {
    nav: { home: 'Home', catalog: 'Catalog', divisions: 'Divisions', legacy: 'Legacy', portal: 'Private Portal' },
    hero: {
      since: 'Textile Manufacturers & Suppliers • Since 1962',
      title1: 'Thermal Blankets.',
      title2: 'Corporate Wholesale.',
      desc: 'High-performance textile infrastructure. At Mano Fil S.A., we are the leading factory in Tlaxcala supplying heavy-duty blankets and tilmas on a corporate scale with direct factory pricing.',
      btnCatalog: 'View Catalog',
      btnMore: 'Our Heritage'
    },
    products: {
      tag: 'Industrial Line',
      title: 'Maximum Textile Performance',
      desc: 'Our products are engineered with strict quality controls to guarantee extreme durability and superior thermal retention for high-volume applications.',
      disclaimer1: '* Colors and dimensions may vary by 5%.',
      disclaimer2: '** "100% regenerated" refers to our sustainable use of recycled fibers (a high-quality blend of acrylic, wool, polyester, and other technical fibers).',
      measures: 'Specifications',
      composition: 'Material',
      quote: 'Request Wholesale Quote',
      items: [
        { title: "Standard Industrial Tilma", weight: "1.300 KG", img: "/products/tilma-eco-1-3kg.webp", desc: "Compact and highly durable weave. Withstands industrial use and constant washing." },
        { title: "Heavyweight Thermal Blanket", weight: "2.000 KG", img: "/products/manta-eco-2kg.webp", desc: "Superior grade thermal insulation. Our highest fabric weight for maximum warmth." },
        { title: "Reinforced Edge Tilma", weight: "1.150 KG", img: "/products/tilma-ribeteada.webp", desc: "Perimeter ultrasonic reinforced finishing for an extended lifespan." },
        { title: "Lightweight Distribution Tilma", weight: "1.000 KG", img: "/products/tilma-eco-1kg.webp", desc: "Optimized for weight and volume. Perfect for agile logistics and rapid deployment." }
      ]
    },
    divisions: {
      textileTitle: 'Textile Supply Division',
      textileDesc: 'We operate a robust logistics network supported by major strategic alliances, ensuring immediate response capacity for massive volume orders nationwide and internationally.',
      textileBtn: 'Textile Sector',
      realEstateTitle: 'Real Estate Development',
      realEstateDesc: 'We design and commercialize world-class industrial parks, logistics warehouses, and commercial complexes.',
      realEstateBtn: 'Real Estate Sector'
    },
    history: {
      tag: 'Corporate Legacy',
      title1: 'Absolute Leadership.',
      title2: 'Forging the Future.',
      p1: 'Founded in <strong class="text-white font-medium">1962</strong>, Mano Fil S.A. was born with an unwavering vocation: consolidating alliances for massive supply operations. From our corporate headquarters in <strong class="text-amber-500 font-bold">Santa Ana Chiautempan, Tlaxcala</strong>, and operating via our flagship domain <em class="text-amber-500/80 not-italic font-serif">cobertores.com</em>, we have perfected the art of large-scale logistics.',
      p2: 'Commercial efficiency is our core directive. This discipline has allowed us to diversify our portfolio, successfully expanding into the real estate sector <strong class="text-white font-medium">8 years ago</strong>. Today, we merge our deep logistics expertise with infrastructure development to drive regional economic growth.',
      stat1: 'Year Established',
      stat2: 'Years in Real Estate',
      badgeTitle: 'Logistics Prestige',
      badgeDesc: 'Over 6 decades<br/>of corporate excellence.'
    },
    footer: {
      desc: 'Mano Fil S.A. - Transforming raw materials into global comfort and infrastructure solutions.',
      locations: 'Operating Headquarters',
      tlaxcala: '<strong class="text-white font-medium">Tlaxcala Distribution Center</strong><br/>El Grullo Street, Santa Ana Chiautempan 90800, Tlaxcala, Mexico',
      cdmx: '<strong class="text-white font-medium">CDMX Commercial Offices</strong><br/>San Borja 613 Int. 702, Del Valle Sur, 03104',
      divs: 'Sectors',
      d1: 'Textile Manufacturing Division',
      d2: 'Real Estate & Construction',
      d3: 'Commercial Management',
      intra: 'Secure Platform',
      i1: 'Corporate Intranet',
      i2: 'Privacy Policy',
      i3: 'Legal Terms',
      i4: 'Cookie Policy',
      rights: 'All rights reserved.',
      design: 'Secured System'
    },
    pillars: {
      title: 'Core Operational Pillars',
      c1_title: 'Contingency Response',
      c1_desc: 'Our products are vital during emergencies (freezes, floods, earthquakes). We guarantee timely deployment when it matters most.',
      c2_title: 'High-Volume Supply',
      c2_desc: 'Backed by top-tier strategic alliances, we possess the capacity to fulfill massive volume orders with remarkably short lead times.',
      c3_title: 'Logistics Commitment',
      c3_desc: 'Our utmost priority is commercial efficiency: executing precise deliveries and providing unsurpassed corporate service.'
    },
    dev: 'Secured System - Encrypted Connection',
    wip: 'Module under maintenance'
  }
};
