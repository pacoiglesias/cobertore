# Informe Técnico y Funcional de la Plataforma (Mano Fil S.A.)

Este documento sirve como un mapa detallado y reporte completo del estado actual de tu aplicación web, su infraestructura, y las tecnologías que la impulsan. 

---

## 1. Visión General del Sistema
La plataforma de **Mano Fil S.A. (`cobertores.com`)** no es solo una página web informativa; es un sistema corporativo completo estructurado en dos partes:
1. **El portal público (B2B):** Orientado a la captación de leads (ventas de alto volumen), construido con un enfoque extremo en SEO, velocidad y un diseño premium.
2. **La intranet (Admin):** Un portal protegido para uso interno del equipo corporativo (gestión de productos, leads, noticias, etc.).

---

## 2. Pila Tecnológica (Tech Stack)
El sitio está construido con tecnologías de última generación, las mismas que utilizan empresas globales:

* **Frontend (Interfaz):** 
  * **React & Next.js (v15/v16):** Permite renderizar las páginas a velocidad ultrarrápida. Está configurado en modo `export` (Static Site Generation), lo que significa que la página ya está procesada antes de que el usuario la pida, reduciendo los tiempos de carga a milisegundos.
  * **Tailwind CSS:** Para un diseño flexible y moderno (Glassmorphism, colores oscuros cinematográficos).
  * **Framer Motion:** Maneja las micro-animaciones (movimientos sutiles) de los elementos, las cuales han sido optimizadas para cargar de forma diferida ("Lazy Load") y no penalizar la velocidad.

* **Backend e Infraestructura (Google Firebase):**
  * **Firebase Hosting:** Aloja los archivos de la página a nivel mundial (CDN), haciéndola muy rápida de cargar desde cualquier país.
  * **Firestore Database:** Base de datos en tiempo real donde viven tus catálogos, leads y noticias.
  * **Firebase Storage:** Almacena imágenes en alta calidad (conectado indirectamente para proveer las URLs).
  * **Cloud Functions:** Pequeños "robots" o microservicios que trabajan en segundo plano (por ejemplo, para generar reportes, respaldos automáticos o enviar alertas de leads).

---

## 3. Módulos y Funcionalidades Principales

### A. Portal Público y Generación de Leads
- **Hero & Landing:** Sección inicial épica con video de fondo (oculto en móviles para ahorrar batería/datos) y mensajes impactantes.
- **Catálogo Dinámico B2B:** Las tarjetas se alimentan directamente de tu base de datos.
- **Formulario Anti-Spam:** Sistema de cotización con mecanismo "Honeypot" (bloquea bots automáticamente) y límite de tasa (máximo 1 cotización cada 5 minutos por usuario). Se integra con **EmailJS** para mandarte las alertas inmediatamente a tu correo.
- **Internacionalización (i18n):** El sistema detecta y permite rutas nativas en `/es/` (Español) y `/en/` (Inglés), con títulos y descripciones distintas para que Google te posicione en ambos mercados.

### B. Intranet y Privacidad
- **Ruta `/intranet`:** Portal restringido donde solo usuarios autorizados (Google Auth / roles definidos) pueden entrar.
- **Autenticación:** Usa las reglas de seguridad estrictas de Firebase para evitar accesos no permitidos.

### C. Motor SEO Avanzado
- **Metadatos Inteligentes:** Los títulos (`<title>`) y descripciones se inyectan a nivel código para cada idioma.
- **Schema JSON-LD:** El sitio "habla" directamente con Google a través de fragmentos de código invisibles (Rich Snippets). 
  - *Organización:* Declara la empresa, dirección, teléfonos y que somos una "ManufacturingBusiness".
  - *Productos:* Cada elemento del catálogo declara su inventario a los rastreadores.
- **OpenGraph & Twitter Cards:** Configurado para que cuando mandes la página por WhatsApp, Facebook o LinkedIn, se pre-cargue una miniatura en alta resolución (`og-image.png`).
- **Sitemap & Robots:** Automatizados para decirle a Google todos los días exactamente qué indexar.

---

## 4. Control de Calidad (Testing & Deploy)
Para proteger la página de caídas o errores, hemos implementado un sistema corporativo de despliegue:

* **Pruebas End-to-End (Playwright):** Tenemos 5 tests automatizados que simulan ser un humano abriendo el sitio, cambiando el idioma, viendo el catálogo e intentando hackear la intranet. 
* **Flujo Maestro de Despliegue (`npm run deploy:all`):** Este comando asegura que:
  1. No se publique NADA si las pruebas automáticas fallan.
  2. Compila el frontend estáticamente.
  3. Revisa y compila las Cloud Functions.
  4. Sube todo sincronizadamente a Firebase en un solo paquete seguro.

---

## Conclusión
Tienes en tus manos un sistema altamente robusto. No es una simple "página de WordPress"; es una arquitectura web de grado *SaaS* (Software as a Service) preparada para recibir picos altísimos de tráfico, con un SEO pulido para el mercado B2B, y blindada con pruebas automatizadas.
