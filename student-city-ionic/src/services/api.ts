import axios from 'axios';
import { getRolesFromToken } from '../utils/jwt';
import { getToken, removeToken } from './auth';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export async function login(email: string, password: string) {
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erreur lors de la connexion');
  }

  const token = data.token;
  const roles = getRolesFromToken(token);
  if (!roles || roles.length === 0) {
    throw new Error("Votre compte n'est pas encore validé.");
  }

  return { token, roles };
}

export async function register(email: string, pseudo: string, password: string) {
  try {
    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pseudo, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erreur lors de l'inscription");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Erreur lors de l'inscription");
  }
}

async function authFetch(input: RequestInfo, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const res = await fetch(input, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    const data = await res.json().catch(() => undefined);
    if (data?.message === 'Expired JWT Token') {
      await removeToken();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }

  return res;
}


export async function fetchPlaces() {
  const res = await authFetch('/api/places');
  if (!res.ok) throw new Error('Erreur lors du chargement des lieux');
  return res.json();
}

export async function addPlace(
  name: string,
  description: string,
  adresse: string,
  latitude: number,
  longitude: number
) {
  const token = await getToken();

  const response = await api.post(
    '/places',
    { name, description, adresse, latitude, longitude },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}

export interface UserItem {
  id: number;
  email: string;
  pseudo: string;
  status: string;
  roles: string[];
  createAt: string;
}

export async function fetchPendingUsers(): Promise<UserItem[]> {
  const token = await getToken();
  const res = await fetch('http://localhost:8000/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Impossible de récupérer les utilisateurs');
  }
  const data = await res.json() as { success: boolean; users: UserItem[] };
  if (!data.success) {
    throw new Error('Erreur inattendue en récupérant les utilisateurs');
  }
  return data.users.filter(u => u.status === 'en attente');
}

export async function approveUser(id: number): Promise<void> {
  const token = await getToken();
  const res = await fetch(
    `http://localhost:8000/api/admin/users/${id}/approve`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || 'Erreur lors de l\'approbation');
  }
}


export async function deleteUser(id: number): Promise<void> {
  const token = await getToken();
  const res = await fetch(`/api/admin/users/${id}/delete`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Erreur lors de la suppression');
  }
}


export interface PlaceItem {
  id: number;
  name: string;
  type?: string;
  adresse: string;
  description: string;
  statut: string;
  createAt?: string;
  latitude?: number;
  longitude?: number;
  user?: { id: number; pseudo: string };
}

export async function fetchPendingPlaces(): Promise<PlaceItem[]> {
  const token = await getToken();
  const res = await fetch(`/api/admin/places?status=${encodeURIComponent('en attente')}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Impossible de récupérer les lieux en attente');
  }
  const data = await res.json() as PlaceItem[];
  return data;
}

export async function approvePlace(id: number): Promise<void> {
  const token = await getToken();
  const res = await fetch(`/api/admin/places/${id}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Erreur lors de la validation');
  }
}

export async function revokePlace(id: number): Promise<void> {
  const token = await getToken();
  const res = await fetch(`/api/admin/places/${id}/revoke`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Erreur lors de la révocation');
  }
}