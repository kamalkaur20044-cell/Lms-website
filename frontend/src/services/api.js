const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const authAPI = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() });
    return res.json();
  },
  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  },
  logout: async () => {
    const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: getAuthHeaders() });
    return res.json();
  }
};

export const studentAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/students`, { headers: getAuthHeaders() });
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    return res.json();
  }
};

export const teacherAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/teachers`, { headers: getAuthHeaders() });
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/teachers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/teachers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/teachers/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    return res.json();
  }
};

export const staffAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/staff`, { headers: getAuthHeaders() });
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    return res.json();
  }
};

export const courseAPI = {
  getPublic: async () => {
    const res = await fetch(`${API_BASE}/courses/public`);
    return res.json();
  },
  getAll: async () => {
    const res = await fetch(`${API_BASE}/courses`, { headers: getAuthHeaders() });
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    return res.json();
  }
};

export const studentPortalAPI = {
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/student-portal/profile`, { headers: getAuthHeaders() });
    return res.json();
  },
  getCourses: async () => {
    const res = await fetch(`${API_BASE}/student-portal/courses`, { headers: getAuthHeaders() });
    return res.json();
  }
};
