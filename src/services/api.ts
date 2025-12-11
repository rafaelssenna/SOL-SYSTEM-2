import axios from "axios";

const API_URL = "https://sol-backend-production.up.railway.app";

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

  createFromPhoto: async (file: File, data: {
    quantity?: number;
    unit?: string;
    priority?: number;
    notes?: string;
    additional_context?: string;
  }) => {
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

  createFromFile: async (file: File, data: {
    quantity?: number;
    notes?: string;
  }) => {
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
  start: async (quotationId: number, targetDiscount: number = 10, channel: string = "whatsapp") => {
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

// Market Search - Busca Automática no Mercado
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

  listSearches: async (limit: number = 20, offset: number = 0) => {
    const response = await api.get("/api/market-search/searches", {
      params: { limit, offset },
    });
    return response.data;
  },

  getSearchResults: async (searchId: number) => {
    const response = await api.get(`/api/market-search/searches/${searchId}`);
    return response.data;
  },

  /**
   * 🧠 BUSCA INTELIGENTE COM IA
   *
   * Esta é a forma mais avançada de busca:
   * 1. IA analisa a descrição e gera queries otimizadas
   * 2. Busca em múltiplas fontes usando extração por IA
   * 3. Analisa resultados e recomenda a melhor opção
   *
   * Diferente da busca tradicional, não quebra quando sites mudam layout
   */
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

// Inventory - Estoque Inteligente
export const inventoryService = {
  listItems: async (params?: {
    category?: string;
    warehouse?: string;
    low_stock_only?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const response = await api.get("/api/inventory/items", { params });
    return response.data;
  },

  getItem: async (id: number) => {
    const response = await api.get(`/api/inventory/items/${id}`);
    return response.data;
  },

  createItem: async (data: Record<string, unknown>) => {
    const response = await api.post("/api/inventory/items", data);
    return response.data;
  },

  recordMovement: async (data: {
    inventory_item_id: number;
    movement_type: string;
    quantity: number;
    unit_cost?: number;
    reason?: string;
  }) => {
    const response = await api.post("/api/inventory/movements", data);
    return response.data;
  },

  getAlerts: async (status?: string, severity?: string) => {
    const response = await api.get("/api/inventory/alerts", {
      params: { status, severity },
    });
    return response.data;
  },

  acknowledgeAlert: async (alertId: number) => {
    const response = await api.post(`/api/inventory/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  resolveAlert: async (alertId: number, notes?: string) => {
    const response = await api.post(`/api/inventory/alerts/${alertId}/resolve`, null, {
      params: { notes },
    });
    return response.data;
  },

  getReorderSuggestions: async () => {
    const response = await api.get("/api/inventory/reorder-suggestions");
    return response.data;
  },

  getValueReport: async (category?: string, warehouse?: string) => {
    const response = await api.get("/api/inventory/value-report", {
      params: { category, warehouse },
    });
    return response.data;
  },

  generateForecast: async (itemId: number, period: string = "monthly") => {
    const response = await api.post(`/api/inventory/items/${itemId}/forecast`, null, {
      params: { period },
    });
    return response.data;
  },
};

// Approvals - Fluxo de Aprovação
export const approvalsService = {
  listRules: async (approvalType?: string, activeOnly: boolean = true) => {
    const response = await api.get("/api/approvals/rules", {
      params: { approval_type: approvalType, active_only: activeOnly },
    });
    return response.data;
  },

  createRule: async (data: Record<string, unknown>) => {
    const response = await api.post("/api/approvals/rules", data);
    return response.data;
  },

  listRequests: async (params?: {
    status?: string;
    approval_type?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await api.get("/api/approvals/requests", { params });
    return response.data;
  },

  getPendingApprovals: async () => {
    const response = await api.get("/api/approvals/requests/pending");
    return response.data;
  },

  getRequest: async (id: number) => {
    const response = await api.get(`/api/approvals/requests/${id}`);
    return response.data;
  },

  createRequest: async (data: Record<string, unknown>) => {
    const response = await api.post("/api/approvals/requests", data);
    return response.data;
  },

  approve: async (id: number, notes?: string, conditions?: string) => {
    const response = await api.post(`/api/approvals/requests/${id}/approve`, {
      notes,
      conditions,
    });
    return response.data;
  },

  reject: async (id: number, reason: string) => {
    const response = await api.post(`/api/approvals/requests/${id}/reject`, {
      notes: reason,
    });
    return response.data;
  },

  delegate: async (id: number, delegateId: number, reason: string) => {
    const response = await api.post(`/api/approvals/requests/${id}/delegate`, {
      delegate_id: delegateId,
      reason,
    });
    return response.data;
  },
};

// Reports - Relatórios e PDF
export const reportsService = {
  getSavings: async (days: number = 30) => {
    const response = await api.get("/api/reports/savings", {
      params: { days },
    });
    return response.data;
  },

  downloadSavingsPdf: async (days: number = 30) => {
    const response = await api.get("/api/reports/savings/pdf", {
      params: { days },
      responseType: "blob",
    });
    return response.data;
  },

  getSupplierRanking: async (rankingType: string = "rating", limit: number = 20) => {
    const response = await api.get("/api/reports/supplier-ranking", {
      params: { ranking_type: rankingType, limit },
    });
    return response.data;
  },

  downloadSupplierRankingPdf: async (rankingType: string = "rating") => {
    const response = await api.get("/api/reports/supplier-ranking/pdf", {
      params: { ranking_type: rankingType },
      responseType: "blob",
    });
    return response.data;
  },

  getInventoryReport: async (category?: string, warehouse?: string) => {
    const response = await api.get("/api/reports/inventory", {
      params: { category, warehouse },
    });
    return response.data;
  },

  downloadInventoryPdf: async (category?: string, warehouse?: string) => {
    const response = await api.get("/api/reports/inventory/pdf", {
      params: { category, warehouse },
      responseType: "blob",
    });
    return response.data;
  },

  downloadQuotationComparisonPdf: async (itemId: number) => {
    const response = await api.get(`/api/reports/quotation-comparison/${itemId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// Cash Guardian - Guardiã do Caixa
export const cashGuardianService = {
  analyzePurchase: async (itemId: number, quantity: number, notes?: string) => {
    const response = await api.post("/api/cash-guardian/analyze-purchase", {
      item_id: itemId,
      requested_quantity: quantity,
      requester_notes: notes,
    });
    return response.data;
  },

  getPriceOpportunities: async (days: number = 30) => {
    const response = await api.get("/api/cash-guardian/price-opportunities", {
      params: { days },
    });
    return response.data;
  },

  getPurchaseSuggestions: async () => {
    const response = await api.get("/api/cash-guardian/purchase-suggestions");
    return response.data;
  },

  getSpendingAnalysis: async (days: number = 90) => {
    const response = await api.get("/api/cash-guardian/spending-analysis", {
      params: { days },
    });
    return response.data;
  },

  shouldBuyNowOrWait: async (itemName: string, currentPrice: number, urgency: string = "normal") => {
    const response = await api.post("/api/cash-guardian/buy-now-or-wait", {
      item_name: itemName,
      current_price: currentPrice,
      urgency,
    });
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get("/api/cash-guardian/dashboard");
    return response.data;
  },
};

// Technical Drawings - Desenhos Técnicos
export const technicalDrawingsService = {
  analyze: async (file: File, drawingType: string = "general", additionalContext?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("drawing_type", drawingType);
    if (additionalContext) {
      formData.append("additional_context", additionalContext);
    }

    const response = await api.post("/api/technical-drawings/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  extractBom: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/technical-drawings/extract-bom", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  compareVersions: async (oldDrawing: File, newDrawing: File) => {
    const formData = new FormData();
    formData.append("old_drawing", oldDrawing);
    formData.append("new_drawing", newDrawing);

    const response = await api.post("/api/technical-drawings/compare-versions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  generatePurchaseList: async (file: File, quantityMultiplier: number = 1) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("quantity_multiplier", String(quantityMultiplier));

    const response = await api.post("/api/technical-drawings/generate-purchase-list", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  identifyFromDrawing: async (file: File, context?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (context) {
      formData.append("context", context);
    }

    const response = await api.post("/api/technical-drawings/identify-from-drawing", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

// Emails - Integração Email
export const emailsService = {
  listAccounts: async () => {
    const response = await api.get("/api/emails/accounts");
    return response.data;
  },

  createAccount: async (data: Record<string, unknown>) => {
    const response = await api.post("/api/emails/accounts", data);
    return response.data;
  },

  testAccount: async (accountId: number) => {
    const response = await api.post(`/api/emails/accounts/${accountId}/test`);
    return response.data;
  },

  listTemplates: async (emailType?: string) => {
    const response = await api.get("/api/emails/templates", {
      params: { email_type: emailType },
    });
    return response.data;
  },

  createTemplate: async (data: Record<string, unknown>) => {
    const response = await api.post("/api/emails/templates", data);
    return response.data;
  },

  sendEmail: async (data: {
    to_emails: string[];
    subject: string;
    body_html: string;
    body_text?: string;
    cc_emails?: string[];
    template_id?: number;
    template_variables?: Record<string, unknown>;
  }) => {
    const response = await api.post("/api/emails/send", data);
    return response.data;
  },

  sendQuotationRequest: async (data: {
    supplier_email: string;
    supplier_name: string;
    item_name: string;
    item_details: string;
    quantity: number;
    specifications?: Record<string, unknown>;
  }) => {
    const response = await api.post("/api/emails/send-quotation-request", data);
    return response.data;
  },

  fetchInbox: async (unseenOnly: boolean = true, limit: number = 50) => {
    const response = await api.get("/api/emails/inbox", {
      params: { unseen_only: unseenOnly, limit },
    });
    return response.data;
  },

  parseQuotation: async (emailData: Record<string, unknown>) => {
    const response = await api.post("/api/emails/parse-quotation", emailData);
    return response.data;
  },

  listSentMessages: async (params?: {
    email_type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await api.get("/api/emails/messages", { params });
    return response.data;
  },
};

// ============================================================================
// WEB SEARCH - Busca na Internet com OpenAI Web Search
// ============================================================================

/**
 * Serviço de busca na web usando OpenAI Web Search
 *
 * FUNCIONALIDADES:
 * 1. Busca fornecedores locais na região do cliente
 * 2. Encontra quem vende o produto solicitado
 * 3. Obtém dados de contato (telefone, WhatsApp, endereço)
 * 4. Compara preços entre opções locais e online
 */
export const webSearchService = {
  /**
   * BUSCA FORNECEDORES LOCAIS
   *
   * Busca na internet em tempo real por empresas que vendem o produto
   * na região especificada.
   */
  searchLocalSuppliers: async (data: {
    product_description: string;
    city: string;
    state: string;
    max_results?: number;
  }) => {
    const response = await api.post("/api/web-search/local-suppliers", data);
    return response.data;
  },

  /**
   * BUSCA PRECOS EM TEMPO REAL
   *
   * Busca precos atuais do produto em lojas locais e/ou online.
   */
  searchPrices: async (data: {
    product_description: string;
    city?: string;
    state?: string;
    include_online?: boolean;
  }) => {
    const response = await api.post("/api/web-search/prices", data);
    return response.data;
  },

  /**
   * BUSCA INTELIGENTE DE FORNECEDORES (PRINCIPAL)
   *
   * Esta e a busca mais completa e recomendada:
   * 1. Encontra lojas fisicas na cidade do cliente
   * 2. Pesquisa em marketplaces (Mercado Livre, Amazon, etc)
   * 3. Compara precos e faz recomendacao personalizada
   *
   * @param urgency - "urgent" (precisa hoje), "normal" (3-5 dias), "flexible" (menor preco)
   */
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

  /**
   * Verifica se o servico de busca web esta operacional
   */
  healthCheck: async () => {
    const response = await api.get("/api/web-search/health");
    return response.data;
  },
};
