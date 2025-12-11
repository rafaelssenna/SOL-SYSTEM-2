"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MessageSquare,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { quotationsService, suppliersService } from "@/services/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Quotation, Supplier, NegotiationStatus } from "@/types";

interface NegotiationData {
  id: number;
  quotation_id: number;
  supplier_id: number;
  status: NegotiationStatus;
  channel: string;
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

export default function NegotiationsPage() {
  const [search, setSearch] = useState("");

  // Por enquanto, mostramos cotações que estão em negociação
  const { data: quotationsData, isLoading } = useQuery({
    queryKey: ["quotations-negotiating"],
    queryFn: () => quotationsService.list({ status: "negotiating", per_page: 100 }),
  });

  const { data: allQuotations } = useQuery({
    queryKey: ["quotations-all"],
    queryFn: () => quotationsService.list({ per_page: 100 }),
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers-all"],
    queryFn: () => suppliersService.list({ per_page: 100 }),
  });

  const getSupplier = (supplierId: number): Supplier | undefined => {
    return suppliersData?.suppliers?.find((s: Supplier) => s.id === supplierId);
  };

  // Stats das negociações
  const stats = {
    total: allQuotations?.quotations?.length || 0,
    negotiating: quotationsData?.quotations?.length || 0,
    successful: allQuotations?.quotations?.filter((q: Quotation) => q.status === "accepted")?.length || 0,
    failed: allQuotations?.quotations?.filter((q: Quotation) => q.status === "rejected")?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Negociações</h1>
        <p className="mt-1 text-slate-400">
          Acompanhe as negociações com fornecedores via IA
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.negotiating}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Aceitas</p>
                <p className="text-2xl font-bold text-green-400">{stats.successful}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Rejeitadas</p>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar negociações..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Negotiations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            Negociações em Andamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : quotationsData?.quotations?.length > 0 ? (
            <div className="space-y-4">
              {quotationsData.quotations.map((quotation: Quotation) => {
                const supplier = getSupplier(quotation.supplier_id);
                return (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/50 p-4 hover:bg-slate-700"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {supplier?.name || `Fornecedor #${quotation.supplier_id}`}
                        </span>
                        <StatusBadge status={quotation.status} />
                      </div>
                      <p className="text-sm text-slate-400">
                        Item #{quotation.item_id} - Cotação #{quotation.id}
                      </p>
                    </div>
                    <div className="text-right">
                      {quotation.final_price && (
                        <p className="font-semibold text-green-400">
                          {formatCurrency(quotation.final_price)}
                        </p>
                      )}
                      <p className="text-sm text-slate-400">
                        {formatDate(quotation.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-slate-400">
              <MessageSquare className="mb-2 h-12 w-12 text-slate-500" />
              <p>Nenhuma negociação em andamento</p>
              <p className="text-sm">
                Inicie uma negociação a partir de uma cotação recebida
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Como funciona a negociação com IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-900/30 border border-blue-500/30 p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                <span className="font-bold text-blue-400">1</span>
              </div>
              <h3 className="font-medium text-white">Selecione a cotação</h3>
              <p className="text-sm text-slate-400">
                Escolha uma cotação recebida e defina o desconto desejado
              </p>
            </div>
            <div className="rounded-lg bg-purple-900/30 border border-purple-500/30 p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                <span className="font-bold text-purple-400">2</span>
              </div>
              <h3 className="font-medium text-white">IA negocia via WhatsApp</h3>
              <p className="text-sm text-slate-400">
                Nossa IA conversa com o fornecedor buscando o melhor preço
              </p>
            </div>
            <div className="rounded-lg bg-green-900/30 border border-green-500/30 p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                <span className="font-bold text-green-400">3</span>
              </div>
              <h3 className="font-medium text-white">Aprove ou ajuste</h3>
              <p className="text-sm text-slate-400">
                Revise o resultado e aprove a compra com desconto negociado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
