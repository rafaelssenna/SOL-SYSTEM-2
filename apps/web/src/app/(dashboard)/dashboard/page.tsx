"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Package,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => analyticsService.dashboard(30),
  });

  const stats = [
    {
      title: "Total de Itens",
      value: data?.items?.total || 0,
      change: `+${data?.items?.period || 0} este mês`,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Fornecedores",
      value: data?.suppliers?.total || 0,
      change: "Ativos",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Cotações",
      value: data?.quotations?.total || 0,
      change: `${data?.quotations?.period || 0} este mês`,
      icon: FileText,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Taxa de Sucesso",
      value: `${data?.negotiations?.success_rate?.toFixed(1) || 0}%`,
      change: `${data?.negotiations?.successful || 0} negociações`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das operações dos últimos 30 dias
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Savings Card */}
      <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-2 bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle>Economia Total</CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">
            {isLoading ? "..." : formatCurrency(data?.savings?.total || 0)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Desconto médio de {data?.savings?.average_discount_percent?.toFixed(1) || 0}%
          </p>
        </CardContent>
      </Card>

      {/* Status Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Itens por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.items?.by_status &&
                Object.entries(data.items.by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-muted-foreground">
                      {status.replace("_", " ")}
                    </span>
                    <span className="font-semibold">{count as number}</span>
                  </div>
                ))}
              {!data?.items?.by_status && (
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Cotações por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.quotations?.by_status &&
                Object.entries(data.quotations.by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-muted-foreground">
                      {status.replace("_", " ")}
                    </span>
                    <span className="font-semibold">{count as number}</span>
                  </div>
                ))}
              {!data?.quotations?.by_status && (
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/items"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:border-primary transition-all"
            >
              <Package className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Novo Item</span>
            </a>
            <a
              href="/quotations"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:border-primary transition-all"
            >
              <FileText className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Solicitar Cotação</span>
            </a>
            <a
              href="/search"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:border-primary transition-all"
            >
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Buscar no Mercado</span>
            </a>
            <a
              href="/reports"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:border-primary transition-all"
            >
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="font-medium">Ver Relatórios</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
