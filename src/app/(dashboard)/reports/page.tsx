"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/services/api";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard-30"],
    queryFn: () => analyticsService.dashboard(30),
  });

  const { data: savings, isLoading: savingsLoading } = useQuery({
    queryKey: ["savings-report"],
    queryFn: () => analyticsService.savingsReport(30),
  });

  const { data: supplierRanking } = useQuery({
    queryKey: ["supplier-ranking"],
    queryFn: () => analyticsService.supplierRanking(),
  });

  const { data: categoryAnalysis } = useQuery({
    queryKey: ["category-analysis"],
    queryFn: () => analyticsService.categoryAnalysis(),
  });

  const isLoading = dashboardLoading || savingsLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>
          <p className="mt-1 text-slate-400">
            Análises e métricas do sistema nos últimos 30 dias
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Economia Total</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(savings?.total_savings || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Itens Processados</p>
                <p className="text-2xl font-bold text-white">{dashboard?.items?.total || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Cotações Recebidas</p>
                <p className="text-2xl font-bold text-white">{dashboard?.quotations?.total || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-white">
                  {dashboard?.negotiations?.success_rate?.toFixed(0) || 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Savings Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5 text-green-400" />
              Relatório de Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-300">Total Economizado</span>
                <span className="font-bold text-green-400">
                  {formatCurrency(savings?.total_savings || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-300">Desconto Médio</span>
                <span className="font-semibold text-white">
                  {savings?.average_discount_percent?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-300">Negociações Bem-sucedidas</span>
                <span className="font-semibold text-white">
                  {savings?.successful_negotiations || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Período</span>
                <span className="text-sm text-slate-400">Últimos 30 dias</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-blue-400" />
              Ranking de Fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplierRanking?.ranking?.length > 0 ? (
              <div className="space-y-3">
                {supplierRanking.ranking.slice(0, 5).map((supplier: {
                  supplier_id: number;
                  supplier_name: string;
                  total_orders: number;
                  average_rating: number;
                  on_time_rate: number;
                }, idx: number) => (
                  <div
                    key={supplier.supplier_id}
                    className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          idx === 0
                            ? "bg-yellow-500/20 text-yellow-400"
                            : idx === 1
                            ? "bg-slate-500/20 text-slate-300"
                            : idx === 2
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-slate-600/50 text-slate-400"
                        } font-bold`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white">{supplier.supplier_name}</p>
                        <p className="text-xs text-slate-400">
                          {supplier.total_orders} pedidos | {supplier.on_time_rate}% no prazo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <span className="font-semibold">
                        {supplier.average_rating?.toFixed(1) || "-"}
                      </span>
                      <span>★</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">
                Nenhum fornecedor avaliado ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Análise por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryAnalysis?.categories?.length > 0 ? (
              <div className="space-y-3">
                {categoryAnalysis.categories.slice(0, 5).map((cat: {
                  category: string;
                  total_items: number;
                  total_value: number;
                  average_price: number;
                }) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{cat.category || "Sem categoria"}</span>
                      <span className="font-medium text-white">{cat.total_items} itens</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${Math.min(
                            (cat.total_items / (categoryAnalysis.categories[0]?.total_items || 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      Valor total: {formatCurrency(cat.total_value || 0)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">
                Nenhuma categoria registrada ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-cyan-400" />
              Visão Geral de Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dashboard?.items?.by_status || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-slate-300 capitalize">
                    {status.replace("_", " ")}
                  </span>
                  <span className="font-semibold text-white">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
