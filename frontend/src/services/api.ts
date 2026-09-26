const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Ensures HTTP-only auth cookies are sent and stored
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP ${response.status}: Request failed`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export { API_BASE };
