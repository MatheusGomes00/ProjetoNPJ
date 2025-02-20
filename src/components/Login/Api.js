const API_URL = "http://localhost:8080";

const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem("token");

    // Caso o token esteja ausente ou inválido
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token inválido ou expirado.");
    }

    return response.json();
  },

  post: async (endpoint, body) => {
    const token = localStorage.getItem("token");

    // Caso o token esteja ausente ou inválido
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Token inválido ou expirado.");
    }

    return response.json();
  },
};

export default api;
