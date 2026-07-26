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
      defaultMeasures: '2m x 1.50m aprox.',
      composition: 'Material',
      defaultComposition: '100% Regenerado',
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
    ribbon: {
      badge: 'Fundada en 1962 — Más de 6 décadas de liderazgo industrial',
      s1v: 'Trayectoria', s1l: 'Manufactura textil desde 1962',
      s2v: 'Escala mayorista', s2l: 'Distribución a nivel nacional',
      s3v: 'Doble división', s3l: 'Textil e inmobiliaria bajo un mismo grupo'
    },
    dual: {
      eyebrow: 'Dos divisiones, un mismo grupo',
      intro: 'Comercialización logística y patrimonio inmobiliario, bajo una sola disciplina corporativa.',
      tEyebrow: 'División Textil · Cobertores.com',
      tTitle: 'Distribución Textil de Alta Gama.',
      tCopy: 'Cobertores, blancos para el hogar, hilos y telas técnicas. Suministramos volúmenes corporativos respaldados por rigurosos controles de calidad y alianzas estratégicas a nivel nacional e internacional.',
      tB1: 'Cobertores y blancos para el hogar',
      tB2: 'Hilos industriales y telas técnicas',
      tB3: 'Distribución logística certificada',
      tCta: 'Explorar catálogo textil',
      tAlt: 'Textura de cobertor de lujo sobre telar industrial',
      rEyebrow: 'División Inmobiliaria',
      rTitle: 'Bienes raíces & desarrollos industriales.',
      rCopy: 'Naves industriales, desarrollos comerciales y activos residenciales estratégicos, planeados con el mismo rigor operativo que ha definido a nuestra comercialización logística desde 1962. Patrimonio que se administra, no solo se construye.',
      rB1: 'Naves y parques industriales',
      rB2: 'Desarrollos comerciales',
      rB3: 'Activos residenciales estratégicos',
      rCta: 'Ver portafolio inmobiliario',
      rAlt: 'Fachada de nave industrial moderna del portafolio inmobiliario'
    },
    heritage: {
      eyebrow: 'Herencia industrial',
      title: 'De un telar a un grupo empresarial.',
      intro: 'Mano Fil S.A. nació en 1962 como un taller textil familiar orientado a la calidad manufacturera. Ese mismo rigor —precisión en el proceso, disciplina en la administración, visión de largo plazo— fue lo que, décadas después, nos permitió capitalizar nuestros activos y expandirnos hacia el desarrollo inmobiliario e industrial. Hoy, el grupo opera dos divisiones que comparten un mismo principio: construir valor que perdura.',
      y1: '1962', t1: 'Fundación del taller textil',
      d1: 'Inicio de operaciones de manufactura textil, con foco en calidad de hilado y confección a escala.',
      y2: '1980—1990', t2: 'Expansión industrial',
      d2: 'Modernización de maquinaria y consolidación como proveedor mayorista de cobertores y blancos para el hogar.',
      y3: '2000', t3: 'Nace la División Inmobiliaria',
      d3: 'La experiencia en administración de activos industriales se traduce en desarrollo y arrendamiento de naves y desarrollos comerciales.',
      y4: 'Hoy', t4: 'Grupo consolidado de doble división',
      d4: 'Manufactura textil de exportación y un portafolio inmobiliario en crecimiento sostenido, bajo una misma disciplina corporativa.'
    },
    sustain: {
      eyebrow: 'Compromiso ambiental',
      title: 'Solidez industrial con responsabilidad de largo plazo.',
      c1tag: 'Producción Textil', c1title: 'Procesos textiles de menor impacto',
      c1desc: 'Optimización del consumo hídrico y energético en el proceso de hilado y teñido, uso creciente de fibras de origen responsable, y tratamiento de aguas residuales previo a su reincorporación al proceso productivo.',
      c2tag: 'Desarrollo Inmobiliario', c2title: 'Edificaciones de bajo impacto',
      c2desc: 'Criterios de eficiencia energética e hídrica en el diseño de naves y desarrollos comerciales, gestión responsable de residuos de obra y selección de materiales de menor huella ambiental en cada proyecto.'
    },
    news: {
      tag: 'Actualidad', title: 'Últimas Noticias',
      read: 'Leer Artículo', all: 'Ver Todas las Noticias', portal: 'Portal de Noticias (RSS)'
    },
    faq: {
      tag: 'Preguntas Frecuentes', title: 'Resolvemos tus Dudas',
      q1: '¿Dónde puedo comprar cobijas y cobertores por mayoreo?',
      a1: 'En Mano Fil S.A. somos la fábrica principal en Tlaxcala especializada en la venta por mayoreo de cobertores, cobijas y tilmas. Hacemos envíos corporativos a todo México con capacidad de respuesta inmediata y precios de fábrica directo.',
      q2: '¿Qué son las tilmas y para qué se utilizan en la industria?',
      a2: 'Las tilmas económicas son cobertores rústicos y altamente duraderos, elaborados generalmente de material 100% regenerado. Se usan masivamente en mudanzas, donaciones, emergencias y uso industrial debido a su alta resistencia y bajo costo.',
      q3: '¿Manejan cobertores térmicos para invierno?',
      a3: 'Sí, nuestra división textil fabrica mantas y cobertores gruesos con retención térmica superior, ideales para programas sociales, hospitales y distribución mayorista durante contingencias de frío extremo.'
    },
    contact: {
      title: 'Cotización Directa',
      desc: 'Solicita precios de mayoreo para pedidos industriales o licitaciones.',
      name: 'Nombre o Empresa *', namePh: 'Ej. Grupo Industrial M...',
      phone: 'Teléfono / WhatsApp *', email: 'Correo Electrónico *', emailPh: 'tu@empresa.com',
      qty: 'Volumen Requerido *', qtyPh: 'Ej. 20,000 piezas',
      msg: 'Detalles del Proyecto *', msgPh: 'Especifica modelos de interés, fecha de entrega y destino...',
      send: 'Enviar Solicitud', sending: 'Enviando...'
    },
    dev: 'Sistema Seguro - Conexión Cifrada',
    wip: 'Módulo en mantenimiento'
  },
  en: {
    nav: { home: 'Home', catalog: 'Catalog', divisions: 'Divisions', legacy: 'Legacy', portal: 'Private Portal' },
    hero: {
      since: 'Blanket Manufacturer & Wholesale Supplier • Since 1962',
      title1: 'Thermal Blankets.',
      title2: 'Corporate Wholesale.',
      desc: 'High-performance textile infrastructure. At Mano Fil S.A., we are the leading factory in Tlaxcala supplying heavy-duty blankets and tilmas (traditional Mexican woven blankets) on a corporate scale with direct factory pricing.',
      btnCatalog: 'View Catalog',
      btnMore: 'Our Heritage'
    },
    products: {
      tag: 'Industrial Line',
      title: 'Maximum Textile Performance',
      desc: 'Our products are engineered with strict quality controls to guarantee extreme durability and superior thermal retention for high-volume applications.',
      disclaimer1: '* Colors and dimensions may vary by 5%.',
      disclaimer2: '** "100% regenerated" refers to the use of recycled fibers (a blend of acrylic, wool, polyester, and other fibers).',
      measures: 'Specifications',
      defaultMeasures: 'Approx. 2m x 1.50m',
      composition: 'Material',
      defaultComposition: '100% Recycled Fibers',
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
      p1: 'Founded in <strong class="text-white font-medium">1962</strong>, Mano Fil S.A. was born with an unwavering vocation: consolidating alliances for massive supply operations. From our corporate headquarters in <strong class="text-amber-500 font-bold">Santa Ana Chiautempan, Tlaxcala</strong>, and operating via our flagship domain <em class="text-amber-500/80 not-italic font-serif">cobertores.com</em>, we have perfected the art of large-scale logistics, delivering flawless results nationwide.',
      p2: 'Commercial efficiency is our core directive. This discipline has allowed us to diversify our portfolio, successfully expanding into the real estate sector <strong class="text-white font-medium">8 years ago</strong>. Today, we merge our deep logistics expertise with infrastructure development to drive economic growth.',
      stat1: 'Year Established',
      stat2: 'Years in Real Estate',
      badgeTitle: 'Logistics Prestige',
      badgeDesc: 'Over 6 decades<br/>of excellence and proven corporate results.'
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
    ribbon: {
      badge: 'Founded in 1962 — Over 6 decades of industrial leadership',
      s1v: 'Track Record', s1l: 'Textile manufacturing since 1962',
      s2v: 'Wholesale Scale', s2l: 'Nationwide distribution',
      s3v: 'Dual Division', s3l: 'Textiles and real estate under one group'
    },
    dual: {
      eyebrow: 'Two divisions, one group',
      intro: 'Logistics distribution and real estate assets, under a single corporate discipline.',
      tEyebrow: 'Textile Division · Cobertores.com',
      tTitle: 'Premium Textile Distribution.',
      tCopy: 'Blankets, home linens, yarns and technical fabrics. We supply corporate volumes backed by rigorous quality controls and strategic alliances at national and international level.',
      tB1: 'Blankets and home linens',
      tB2: 'Industrial yarns and technical fabrics',
      tB3: 'Certified logistics distribution',
      tCta: 'Explore textile catalog',
      tAlt: 'Luxury blanket texture on an industrial loom',
      rEyebrow: 'Real Estate Division',
      rTitle: 'Real estate & industrial developments.',
      rCopy: 'Industrial warehouses, commercial developments and strategic residential assets, planned with the same operational rigor that has defined our logistics business since 1962. Assets that are managed, not just built.',
      rB1: 'Industrial warehouses and parks',
      rB2: 'Commercial developments',
      rB3: 'Strategic residential assets',
      rCta: 'View real estate portfolio',
      rAlt: 'Modern industrial warehouse facade from the real estate portfolio'
    },
    heritage: {
      eyebrow: 'Industrial heritage',
      title: 'From a single loom to a business group.',
      intro: 'Mano Fil S.A. began in 1962 as a family textile workshop focused on manufacturing quality. That same rigor — precision in process, discipline in management, long-term vision — is what, decades later, allowed us to capitalize our assets and expand into real estate and industrial development. Today the group operates two divisions that share one principle: building value that lasts.',
      y1: '1962', t1: 'Founding of the textile workshop',
      d1: 'Textile manufacturing operations begin, focused on spinning quality and production at scale.',
      y2: '1980—1990', t2: 'Industrial expansion',
      d2: 'Machinery modernization and consolidation as a wholesale supplier of blankets and home linens.',
      y3: '2000', t3: 'The Real Estate Division is born',
      d3: 'Experience managing industrial assets translates into the development and leasing of warehouses and commercial projects.',
      y4: 'Today', t4: 'A consolidated dual-division group',
      d4: 'Export-grade textile manufacturing and a steadily growing real estate portfolio, under a single corporate discipline.'
    },
    sustain: {
      eyebrow: 'Environmental commitment',
      title: 'Industrial strength with long-term responsibility.',
      c1tag: 'Textile Production', c1title: 'Lower-impact textile processes',
      c1desc: 'Optimized water and energy consumption in spinning and dyeing, growing use of responsibly sourced fibers, and wastewater treatment before it re-enters the production process.',
      c2tag: 'Real Estate Development', c2title: 'Low-impact construction',
      c2desc: 'Energy and water efficiency criteria in the design of warehouses and commercial developments, responsible construction waste management, and selection of lower-footprint materials in every project.'
    },
    news: {
      tag: 'Latest', title: 'Industry News',
      read: 'Read Article', all: 'View All News', portal: 'News Portal (RSS)'
    },
    faq: {
      tag: 'Frequently Asked Questions', title: 'Your Questions, Answered',
      q1: 'Where can I buy blankets wholesale?',
      a1: 'At Mano Fil S.A., we are the leading factory in Tlaxcala specializing in wholesale distribution of heavy-duty blankets and tilmas. We handle corporate shipments across Mexico with immediate response capabilities and direct factory pricing.',
      q2: 'What are tilmas and how are they used in industry?',
      a2: 'Economic tilmas are highly durable, rustic blankets generally made from 100% recycled fibers. They are massively used in moving operations, donations, emergencies, and industrial use due to their high resistance and low cost.',
      q3: 'Do you offer thermal blankets for winter?',
      a3: 'Yes, our textile division manufactures thick blankets with superior thermal retention, ideal for social programs, hospitals, and wholesale distribution during extreme cold weather contingencies.'
    },
    contact: {
      title: 'Request a Quote',
      desc: 'Request wholesale pricing for industrial orders or public tenders.',
      name: 'Name or Company *', namePh: 'e.g. Industrial Group M...',
      phone: 'Phone / WhatsApp *', email: 'Email Address *', emailPh: 'you@company.com',
      qty: 'Volume Required *', qtyPh: 'e.g. 20,000 units',
      msg: 'Project Details *', msgPh: 'Specify models of interest, delivery date and destination...',
      send: 'Send Request', sending: 'Sending...'
    },
    dev: 'Secured System - Encrypted Connection',
    wip: 'Module under maintenance'
  }
};
