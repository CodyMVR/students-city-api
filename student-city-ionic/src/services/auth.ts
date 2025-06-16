import { Storage } from '@ionic/storage';

let storage: Storage;

export async function initStorage() {
  const s = new Storage();
  await s.create();
  storage = s;
}

export async function setToken(token: string) {
  await storage.set('token', token);
}

export async function getToken(): Promise<string | null> {
  return storage.get('token');
}

export async function removeToken() {
  await storage.remove('token');
}
