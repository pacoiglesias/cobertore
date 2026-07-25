/**
 * Constantes compartidas del sistema Cobertores
 * Estas constantes se usan tanto en el frontend como referencia
 * para mantener sincronización con Cloud Functions y Security Rules.
 * 
 * NOTA: Las Security Rules (firestore.rules, storage.rules) y Cloud Functions
 * (functions/src/index.ts) tienen sus propias copias de SUPER_ADMIN_EMAILS
 * porque no pueden importar código externo. Cualquier cambio aquí DEBE
 * replicarse manualmente en esos 3 lugares.
 */

export const SUPER_ADMIN_EMAILS = [
  'paco@cobertores.com',
  'paco.iglesias@gmail.com',
  'pacoismael@gmail.com',
] as const;

export const APP_VERSION = '0.3.0';

export const COMPANY = {
  name: 'Mano Fil S.A.',
  phone: '+52 246 464 2891',
  email: 'paco@cobertores.com',
  location: 'Santa Ana Chiautempan, Tlaxcala, México',
  foundingYear: 1962,
  website: 'https://cobertores.com',
} as const;
