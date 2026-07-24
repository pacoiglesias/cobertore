const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, deleteDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'cobertores-web',
    firestore: {
      rules: fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Mano Fil S.A. - Firestore Security Rules', () => {
  
  // 1. Super Admin Tests
  it('allows Super Admin full access regardless of user_privileges', async () => {
    const superAdminDb = testEnv.authenticatedContext('super-admin-uid', {
      email: 'pacoismael@gmail.com',
    }).firestore();
    
    const fileDoc = doc(superAdminDb, 'intranet_files/file-123');
    await assertSucceeds(setDoc(fileDoc, { name: 'secret.txt', url: '...' }));
  });

  // 2. User with no privileges
  it('fails read/write on intranet files for user with no privileges', async () => {
    const unprivilegedDb = testEnv.authenticatedContext('user-uid', {
      email: 'stranger@gmail.com',
    }).firestore();
    
    const fileDoc = doc(unprivilegedDb, 'intranet_files/file-123');
    await assertFails(getDoc(fileDoc));
    await assertFails(setDoc(fileDoc, { name: 'exploit.txt' }));
  });

  // 3. User with expired privilege
  it('fails read/write on intranet files if privilege is expired', async () => {
    // Setup privilege document in admin context
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'user_privileges/expired@cobertores.com'), {
        email: 'expired@cobertores.com',
        role: 'editor',
        expiresAt: new Date(Date.now() - 3600000), // Expired 1 hour ago
      });
    });

    const expiredDb = testEnv.authenticatedContext('expired-uid', {
      email: 'expired@cobertores.com',
    }).firestore();
    
    const fileDoc = doc(expiredDb, 'intranet_files/file-123');
    await assertFails(getDoc(fileDoc));
  });

  // 4. Valid privilege: Lector
  it('allows read but rejects write for lector role', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'user_privileges/lector@cobertores.com'), {
        email: 'lector@cobertores.com',
        role: 'lector',
        expiresAt: null, // Never expires
      });
    });

    const lectorDb = testEnv.authenticatedContext('lector-uid', {
      email: 'lector@cobertores.com',
    }).firestore();
    
    const fileDoc = doc(lectorDb, 'intranet_files/file-123');
    await assertSucceeds(getDoc(fileDoc));
    await assertFails(setDoc(fileDoc, { name: 'write-attempt.txt' }));
  });

  // 5. Valid privilege: Editor
  it('allows read and write for editor role', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'user_privileges/editor@cobertores.com'), {
        email: 'editor@cobertores.com',
        role: 'editor',
        expiresAt: new Date(Date.now() + 3600000), // Valid for 1 hour
      });
    });

    const editorDb = testEnv.authenticatedContext('editor-uid', {
      email: 'editor@cobertores.com',
    }).firestore();
    
    const fileDoc = doc(editorDb, 'intranet_files/file-123');
    await assertSucceeds(getDoc(fileDoc));
    await assertSucceeds(setDoc(fileDoc, { name: 'doc.txt', url: '...' }));
  });
});
