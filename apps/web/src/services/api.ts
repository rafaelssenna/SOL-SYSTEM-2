import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sol-backend-production.up.railway.app";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
    department?: string;
    phone?: string;
  }) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  me: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

// Items
export const itemsService = {
  list: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    category?: string;
    search?: string;
  }) => {
    const response = await api.get("/api/items", { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await api.get(`/api/items/${id}`);
    return response.data;
  },

  createFromPhoto: async (
    file: File,
    data: {
      quantity?: number;
      unit?: string;
      priority?: number;
      notes?: string;
      additional_context?: string;
    }
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post("/api/items/from-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  createFromDescription: async (data: {
    description: string;
    quantity?: number;
    unit?: string;
    priority?: number;
    notes?: string;
  }) => {
    const response = await api.post("/api/items/from-description", data);
    return response.data;
  },

  createFromFile: async (
    file: File,
    data: {
      quantity?: number;
      notes?: string;
    }
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post("/api/items/from-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put(`/api/items/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/items/${id}`);
  },

  startQuotation: async (id: number) => {
    const response = await api.post(`/api/items/${id}/start-quotation`);
    return response.data;
  },
};

// Suppliers
export const suppliersService = {
  list: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    category?: string;
    search?: string;
    city?: string;
    state?: string;
  }) => {
    const response = await api.get("/api/suppliers", { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await api.get(`/api/suppliers/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    const response = await api.post("/api/suppliers", data);
    return response.data;
  },

  update: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put(`/api/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/suppliers/${id}`);
  },

  getStats: async (id: number) => {
    const response = await api.get(`/api/suppliers/${id}/stats`);
    return response.data;
  },
};

// Quotations
export const quotationsService = {
  list: async (params?: {
    page?: number;
    per_page?: number;
    item_id?: number;
    supplier_id?: number;
    status?: string;
  }) => {
    const response = await api.get("/api/quotations", { params });
    return response.data;
  },

  request: async (itemId: number, supplierIds: number[]) => {
    const response = await api.post("/api/quotations/request", null, {
      params: { item_id: itemId, supplier_ids: supplierIds },
    });
    return response.data;
  },

  receive: async (id: number, data: Record<string, unknown>) => {
    const response = await api.post(`/api/quotations/${id}/receive`, data);
    return response.data;
  },

  compare: async (itemId: number) => {
    const response = await api.get(`/api/quotations/item/${itemId}/compare`);
    return response.data;
  },

  accept: async (id: number) => {
    const response = await api.post(`/api/quotations/${id}/accept`);
    return response.data;
  },

  reject: async (id: number, reason?: string) => {
    const response = await api.post(`/api/quotations/${id}/reject`, null, {
      params: { reason },
    });
    return response.data;
  },
};

// Negotiations
export const negotiationsService = {
  start: async (
    quotationId: number,
    targetDiscount: number = 10,
    channel: string = "whatsapp"
  ) => {
    const response = await api.post(`/api/negotiations/start/${quotationId}`, null, {
      params: { target_discount: targetDiscount, channel },
    });
    return response.data;
  },

  get: async (id: number) => {
    const response = await api.get(`/api/negotiations/${id}`);
    return response.data;
  },

  respond: async (id: number, message: string, proposedPrice?: number) => {
    const response = await api.post(`/api/negotiations/${id}/respond`, {
      message,
      proposed_price: proposedPrice,
    });
    return response.data;
  },

  accept: async (id: number, finalPrice: number) => {
    const response = await api.post(`/api/negotiations/${id}/accept`, null, {
      params: { final_price: finalPrice },
    });
    return response.data;
  },

  cancel: async (id: number, reason?: string) => {
    const response = await api.post(`/api/negotiations/${id}/cancel`, null, {
      params: { reason },
    });
    return response.data;
  },
};

// Analytics
export const analyticsService = {
  dashboard: async (periodDays: number = 30) => {
    const response = await api.get("/api/analytics/dashboard", {
      params: { period_days: periodDays },
    });
    return response.data;
  },

  savingsReport: async (periodDays: number = 30) => {
    const response = await api.get("/api/analytics/savings-report", {
      params: { period_days: periodDays },
    });
    return response.data;
  },

  supplierRanking: async () => {
    const response = await api.get("/api/analytics/supplier-ranking");
    return response.data;
  },

  priceHistory: async (itemId: number) => {
    const response = await api.get(`/api/analytics/price-history/${itemId}`);
    return response.data;
  },

  categoryAnalysis: async () => {
    const response = await api.get("/api/analytics/category-analysis");
    return response.data;
  },

  alerts: async () => {
    const response = await api.get("/api/analytics/alerts");
    return response.data;
  },
};

// Market Search
export const marketSearchService = {
  search: async (data: {
    query: string;
    keywords?: string[];
    category?: string;
    brand?: string;
    price_min?: number;
    price_max?: number;
    sources?: string[];
  }) => {
    const response = await api.post("/api/market-search/search", data);
    return response.data;
  },

  searchFromItem: async (itemId: number, sources?: string[]) => {
    const response = await api.post("/api/market-search/search-from-item", {
      item_id: itemId,
      sources,
    });
    return response.data;
  },

  smartSearch: async (data: {
    item_description: string;
    item_image_url?: string;
    budget?: number;
    urgency?: "normal" | "urgent";
    prefer_local?: boolean;
  }) => {
    const response = await api.post("/api/market-search/smart-search", data);
    return response.data;
  },
};

// Web Search
export const webSearchService = {
  searchLocalSuppliers: async (data: {
    product_description: string;
    city: string;
    state: string;
    max_results?: number;
  }) => {
    const response = await api.post("/api/web-search/local-suppliers", data);
    return response.data;
  },

  smartSupplierSearch: async (data: {
    product_description: string;
    client_city: string;
    client_state: string;
    budget?: number;
    urgency?: "urgent" | "normal" | "flexible";
    prefer_local?: boolean;
  }) => {
    const response = await api.post("/api/web-search/smart-supplier-search", data);
    return response.data;
  },
};

// Cash Guardian
export const cashGuardianService = {
  analyzePurchase: async (itemId: number, quantity: number, notes?: string) => {
    const response = await api.post("/api/cash-guardian/analyze-purchase", {
      item_id: itemId,
      requested_quantity: quantity,
      requester_notes: notes,
    });
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get("/api/cash-guardian/dashboard");
    return response.data;
  },
};
