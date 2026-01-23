// Utility per chiamate API al backend

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const API_URL = '/api/proxy';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'banned';
  createdAt?: string;
}

export interface Booking {
  id: number;
  serviceName: string;
  servicePrice?: number;
  bookingDate: string;
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Helper per ottenere il token dal localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Helper per fare richieste API
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Errore sconosciuto' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API Auth
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ): Promise<{ message: string; user?: User; token?: string }> => {
    const response = await apiRequest<{ message: string; user?: User; token?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, phone }),
    });

    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  verifyEmail: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  resendVerificationEmail: async (email: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  getToken: (): string | null => getToken(),
};

// API Bookings
export const bookingsApi = {
  getAll: async (): Promise<{ bookings: Booking[] }> => {
    return apiRequest<{ bookings: Booking[] }>('/bookings');
  },

  getById: async (id: number): Promise<{ booking: Booking }> => {
    return apiRequest<{ booking: Booking }>(`/bookings/${id}`);
  },

  create: async (booking: {
    serviceName: string;
    servicePrice?: number;
    bookingDate: string;
    durationMinutes?: number;
    notes?: string;
  }): Promise<{ message: string; booking: Booking }> => {
    return apiRequest<{ message: string; booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  update: async (id: number, updates: {
    bookingDate?: string;
    serviceName?: string;
    notes?: string;
  }): Promise<{ message: string; booking: Booking }> => {
    return apiRequest<{ message: string; booking: Booking }>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  getAvailability: async (from?: string, to?: string): Promise<{ slots: { booking_date: string; duration_minutes: number }[] }> => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<{ slots: { booking_date: string; duration_minutes: number }[] }>(`/bookings/availability${query}`);
  },
};

// API Admin
export const adminApi = {
  // ... existing methods ...

  createBooking: async (booking: {
    userId: number;
    serviceName: string;
    servicePrice?: number;
    bookingDate: string;
    durationMinutes?: number;
    notes?: string;
  }): Promise<{ message: string; booking: Booking }> => {
    return apiRequest<{ message: string; booking: Booking }>('/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },

  getAllBookings: async (filters?: {
    status?: string;
    from?: string;
    to?: string;
  }): Promise<{ bookings: Booking[] }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<{ bookings: Booking[] }>(`/admin/bookings${query}`);
  },

  updateBookingStatus: async (
    id: number,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ): Promise<{ message: string; booking: Booking }> => {
    return apiRequest<{ message: string; booking: Booking }>(
      `/admin/bookings/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  },

  updateBooking: async (id: number, updates: Partial<Booking & { serviceName: string; servicePrice: number; durationMinutes: number }>): Promise<{ message: string; booking: Booking }> => {
    return apiRequest<{ message: string; booking: Booking }>(`/admin/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  getAllUsers: async (): Promise<{ users: User[] }> => {
    return apiRequest<{ users: User[] }>('/admin/users');
  },

  updateUser: async (id: number, data: { firstName: string; lastName: string; phone?: string }): Promise<{ message: string; user: User }> => {
    return apiRequest<{ message: string; user: User }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  banUser: async (id: number, banned: boolean): Promise<{ message: string; user: User }> => {
    return apiRequest<{ message: string; user: User }>(`/admin/users/${id}/ban`, {
      method: 'PATCH',
      body: JSON.stringify({ banned }),
    });
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (): Promise<{
    bookings: { byStatus: Array<{ status: string; count: string }>; upcoming: number };
    users: { total: number };
  }> => {
    return apiRequest('/admin/stats');
  },
};

// API User
export const userApi = {
  getProfile: async (): Promise<{ user: User }> => {
    return apiRequest<{ user: User }>('/user/profile');
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ message: string; user: User }> => {
    return apiRequest<{ message: string; user: User }>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// API Services
export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isVisible?: boolean;
}

export const servicesApi = {
  getPublic: async (): Promise<{ services: Service[] }> => {
    return apiRequest<{ services: Service[] }>('/services/public');
  },

  getAll: async (): Promise<{ services: Service[] }> => {
    return apiRequest<{ services: Service[] }>('/services');
  },

  create: async (service: {
    name: string;
    description?: string;
    price: number;
    durationMinutes?: number;
    isVisible?: boolean;
  }): Promise<{ message: string; service: Service }> => {
    return apiRequest<{ message: string; service: Service }>('/services', {
      method: 'POST',
      body: JSON.stringify({
        name: service.name,
        description: service.description,
        price: service.price,
        durationMinutes: service.durationMinutes || 60,
        isVisible: service.isVisible !== undefined ? service.isVisible : true,
      }),
    });
  },

  update: async (
    id: number,
    updates: {
      name?: string;
      description?: string;
      price?: number;
      durationMinutes?: number;
      isVisible?: boolean;
    }
  ): Promise<{ message: string; service: Service }> => {
    return apiRequest<{ message: string; service: Service }>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

