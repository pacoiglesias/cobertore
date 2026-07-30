import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Única fuente de verdad de quién es Súper Admin.
 *
 * Antes esta lista estaba duplicada en varios archivos, y cada vez que
 * una sesión reestructuraba el código, alguna copia se perdía y con ella
 * la validación de seguridad. Ahora vive en un solo lugar: si hay que
 * agregar o quitar a alguien, se hace aquí y aplica en todo el sistema.
 */
export const SUPER_ADMINS = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS.split(',').map(e => e.trim())
  : [
      'paco@cobertores.com',
      'paco.iglesias@gmail.com',
      'pacoismael@gmail.com',
    ];

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMINS.includes(email);
}

/**
 * Determina si un correo tiene permitido entrar a la intranet.
 *
 * Es Súper Admin, o tiene un privilegio vigente (editor / lector /
 * almacen) registrado en la colección `user_privileges` de Firestore.
 *
 * IMPORTANTE: esto es una verificación del lado del cliente, pensada para
 * la experiencia de usuario (no dejar entrar a la interfaz a quien no
 * corresponde). La seguridad real de los DATOS la imponen las Firestore
 * Rules del servidor, que ya validan lo mismo de forma independiente.
 */
export async function isAuthorizedUser(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  if (isSuperAdminEmail(email)) return true;

  try {
    const privDoc = await getDoc(doc(db, 'user_privileges', email));
    if (!privDoc.exists()) return false;

    const data = privDoc.data();
    const noExpirado = !data.expiresAt || data.expiresAt.toDate() > new Date();
    const rolValido = ['editor', 'lector', 'almacen'].includes(data.role);

    return noExpirado && rolValido;
  } catch {
    // Ante cualquier error de lectura, negar el acceso (fail closed).
    return false;
  }
}
