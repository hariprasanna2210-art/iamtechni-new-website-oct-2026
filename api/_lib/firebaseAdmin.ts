import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

export class MissingEnvVariableError extends Error {
  public readonly variableName: string;

  constructor(variableName: string) {
    super(`Missing required environment variable: ${variableName}`);
    this.name = 'MissingEnvVariableError';
    this.variableName = variableName;
  }
}

let cachedFirestore: Firestore | null = null;

function parseServiceAccountFromEnv(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw || !raw.trim()) {
    console.error('[firebaseAdmin] Missing environment variable: FIREBASE_SERVICE_ACCOUNT');
    throw new MissingEnvVariableError('FIREBASE_SERVICE_ACCOUNT');
  }

  const trimmed = raw.trim();
  let jsonString = trimmed;

  if (!trimmed.startsWith('{')) {
    try {
      jsonString = Buffer.from(trimmed, 'base64').toString('utf8');
    } catch {
      console.error('[firebaseAdmin] Failed to decode base64 FIREBASE_SERVICE_ACCOUNT');
      throw new MissingEnvVariableError('FIREBASE_SERVICE_ACCOUNT');
    }
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonString) as Record<string, unknown>;
  } catch {
    console.error('[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT is not valid JSON');
    throw new MissingEnvVariableError('FIREBASE_SERVICE_ACCOUNT');
  }

  const privateKeyRaw = parsed.private_key ?? parsed.privateKey;
  const clientEmail = parsed.client_email ?? parsed.clientEmail;
  const projectId = parsed.project_id ?? parsed.projectId;

  if (
    typeof privateKeyRaw !== 'string' ||
    typeof clientEmail !== 'string' ||
    typeof projectId !== 'string'
  ) {
    console.error(
      '[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT is missing project_id, client_email, or private_key'
    );
    throw new MissingEnvVariableError('FIREBASE_SERVICE_ACCOUNT');
  }

  const normalizedPrivateKey = privateKeyRaw.replace(/\\n/g, '\n');

  return {
    projectId,
    clientEmail,
    privateKey: normalizedPrivateKey,
  };
}

export function getAdminDb(): Firestore {
  if (cachedFirestore) {
    return cachedFirestore;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedFirestore = getFirestore(existingApps[0]);
    return cachedFirestore;
  }

  const serviceAccount = parseServiceAccountFromEnv();
  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  cachedFirestore = getFirestore(app);
  return cachedFirestore;
}

export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const instance = getAdminDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
