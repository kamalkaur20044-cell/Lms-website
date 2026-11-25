const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Central fetch wrapper that always includes credentials for HTTP-only cookies
const apiFetch = async (endpoint, options = {}) => {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Automatically passes & receives HTTP-only cookies
  });

  return res.json();
};

export const authAPI = {
  login: (username, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getMe: () => apiFetch('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  logout: async () => {
    try {
      return await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout API error:', err);
      return { success: true };
    }
  },
};

export const studentAPI = {
  getAll: () => apiFetch('/students'),
  create: (data) =>
    apiFetch('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => apiFetch(`/students/${id}`, { method: 'DELETE' }),
};

export const teacherAPI = {
  getPublic: () => apiFetch('/teachers/public'),
  getAll: () => apiFetch('/teachers'),
  create: (data) =>
    apiFetch('/teachers', {
      method: 'POST',
      body: typeof FormData !== 'undefined' && data instanceof FormData ? data : JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/teachers/${id}`, {
      method: 'PUT',
      body: typeof FormData !== 'undefined' && data instanceof FormData ? data : JSON.stringify(data),
    }),
  delete: (id) => apiFetch(`/teachers/${id}`, { method: 'DELETE' }),
};

export const staffAPI = {
  getAll: () => apiFetch('/staff'),
  create: (data) =>
    apiFetch('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => apiFetch(`/staff/${id}`, { method: 'DELETE' }),
};

export const employeeDutyScheduleAPI = {
  getAll: () => apiFetch('/duty-schedules'),
  getMine: () => apiFetch('/duty-schedules/mine'),
  getForEmployee: (employeeType, employeeId) =>
    apiFetch(`/duty-schedules/employee/${encodeURIComponent(employeeType)}/${encodeURIComponent(employeeId)}`),
  save: (employeeType, employeeId, data) =>
    apiFetch(`/duty-schedules/${encodeURIComponent(employeeType)}/${encodeURIComponent(employeeId)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (employeeType, employeeId) =>
    apiFetch(`/duty-schedules/${encodeURIComponent(employeeType)}/${encodeURIComponent(employeeId)}`, {
      method: 'DELETE',
    }),
};

export const courseAPI = {
  getPublic: () => apiFetch('/courses/public', { cache: 'no-store' }),
  getAll: () => apiFetch('/courses', { cache: 'no-store' }),
  create: (data) =>
    apiFetch('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => apiFetch(`/courses/${id}`, { method: 'DELETE' }),
};

export const galleryAPI = {
  getAll: () => apiFetch('/gallery'),
  upload: (formData) =>
    apiFetch('/gallery', {
      method: 'POST',
      body: formData,
    }),
  delete: (id) => apiFetch(`/gallery/${id}`, { method: 'DELETE' }),
};

export const heroBannerAPI = {
  getActive: () => apiFetch('/hero-banners'),
  getAll: () => apiFetch('/hero-banners/admin'),
  upload: (formData) =>
    apiFetch('/hero-banners', {
      method: 'POST',
      body: formData,
    }),
  setActive: (id, active) =>
    apiFetch(`/hero-banners/${id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    }),
  setDisplayOrder: (id, displayOrder) =>
    apiFetch(`/hero-banners/${id}/order`, {
      method: 'PATCH',
      body: JSON.stringify({ display_order: displayOrder }),
    }),
  delete: (id) => apiFetch(`/hero-banners/${id}`, { method: 'DELETE' }),
};

export const resultAPI = {
  getAll: () => apiFetch('/results'),
  getMine: (studentId) =>
    apiFetch(`/results/mine${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`),
  upload: (formData) =>
    apiFetch('/results/upload', {
      method: 'POST',
      body: formData,
    }),
};

export const studentPortalAPI = {
  getProfile: (studentId) =>
    apiFetch(`/student-portal/profile${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`),
  getCourses: (studentId) =>
    apiFetch(`/student-portal/courses${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`),
};
