// User types
export type UserRole = "admin" | "manager" | "buyer" | "viewer";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

// Item types
export type ItemStatus =
  | "pending"
  | "identified"
  | "searching"
  | "quoting"
  | "negotiating"
  | "quoted"
  | "approved"
  | "ordered"
  | "delivered"
  | "cancelled";

export type ItemSource = "photo" | "description" | "file";

export interface Item {
  id: number;
  source: ItemSource;
  original_description?: string;
  original_file_url?: string;
  name?: string;
  brand?: string;
  model?: string;
  specifications?: Record<string, unknown>;
  category?: string;
  subcategory?: string;
  technical_details?: string;
  suggested_keywords?: string[];
  ai_confidence?: number;
  status: ItemStatus;
  priority: number;
  quantity: number;
  unit: string;
  notes?: string;
  internal_code?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

// Supplier types
export type SupplierType =
  | "distributor"
  | "manufacturer"
  | "retailer"
  | "wholesaler"
  | "importer"
  | "representative"
  | "marketplace";

export type SupplierStatus = "active" | "inactive" | "blocked" | "pending_approval";

export interface Supplier {
  id: number;
  name: string;
  trading_name?: string;
  cnpj?: string;
  type?: SupplierType;
  status: SupplierStatus;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  contact_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  categories?: string[];
  rating: number;
  total_orders: number;
  on_time_delivery_rate: number;
  response_time_hours?: number;
  average_discount: number;
  default_payment_terms?: string;
  minimum_order_value: number;
  free_shipping_above?: number;
  is_verified: boolean;
  accepts_negotiation: boolean;
  has_api_integration: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Quotation types
export type QuotationStatus =
  | "pending"
  | "received"
  | "negotiating"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";

export interface Quotation {
  id: number;
  item_id: number;
  supplier_id: number;
  status: QuotationStatus;
  unit_price?: number;
  quantity: number;
  total_price?: number;
  discount_percent: number;
  discount_value: number;
  final_price?: number;
  shipping_cost: number;
  shipping_type?: string;
  delivery_days?: number;
  validity_days: number;
  expires_at?: string;
  payment_terms?: string;
  payment_method?: string;
  warranty_months?: number;
  product_name?: string;
  product_brand?: string;
  product_model?: string;
  product_code?: string;
  is_original?: boolean;
  is_substitute: boolean;
  score?: number;
  score_breakdown?: Record<string, number>;
  supplier_notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

// Negotiation types
export type NegotiationStatus =
  | "active"
  | "waiting_response"
  | "counter_offer"
  | "success"
  | "failed"
  | "cancelled";

export type NegotiationChannel = "whatsapp" | "email" | "api" | "phone" | "manual";

export interface Negotiation {
  id: number;
  quotation_id: number;
  supplier_id: number;
  status: NegotiationStatus;
  channel: NegotiationChannel;
  initial_price: number;
  target_price?: number;
  final_price?: number;
  discount_achieved?: number;
  savings?: number;
  total_rounds: number;
  max_rounds: number;
  started_at: string;
  completed_at?: string;
}

export interface NegotiationMessage {
  direction: "sent" | "received";
  message: string;
  proposed_price?: number;
  created_at: string;
  is_ai_generated: boolean;
}

// Dashboard types
export interface DashboardData {
  period_days: number;
  items: {
    total: number;
    period: number;
    by_status: Record<string, number>;
  };
  suppliers: {
    total: number;
  };
  quotations: {
    total: number;
    period: number;
    by_status: Record<string, number>;
  };
  negotiations: {
    total: number;
    successful: number;
    success_rate: number;
  };
  savings: {
    total: number;
    average_discount_percent: number;
  };
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
