const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...init?.headers as Record<string, string>
  };

  try {
    const raw = localStorage.getItem('doctor-hub-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed.state?.accessToken;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error reading auth token from localStorage:', error);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message ?? payload.message ?? 'Request failed');
  }
  return payload.data as T;
}
