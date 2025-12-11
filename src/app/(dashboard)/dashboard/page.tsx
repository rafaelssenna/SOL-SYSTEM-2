"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Package,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShoppingCart,
  Clock,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/services/api";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => analyticsService.dashboard(30),
  });

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => analyticsService.alerts(),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const stats = [
    {
      name: "Total de Itens",
      value: dashboard?.items?.total || 0,
      subtext: `+${dashboard?.items?.period || 0} este mês`,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      name: "Fornecedores",
      value: dashboard?.suppliers?.total || 0,
      subtext: "Cadastrados",
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      name: "Cotações",
      value: dashboard?.quotations?.total || 0,
      subtext: `+${dashboard?.quotations?.period || 0} este mês`,
      icon: FileText,
      gradient: "from-violet-500 to-violet-600",
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      name: "Economia Total",
      value: formatCurrency(dashboard?.savings?.total || 0),
      subtext: `${dashboard?.savings?.average_discount_percent?.toFixed(1) || 0}% desconto médio`,
      icon: DollarSign,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  const successRate = dashboard?.negotiations?.success_rate || 0;

  const statusConfig = [
    { key: "pending", label: "Pendentes", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    { key: "identified", label: "Identificados", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/20" },
    { key: "quoting", label: "Em Cotação", icon: Send, color: "text-purple-400", bg: "bg-purple-500/20" },
    { key: "approved", label: "Aprovados", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/20" },
    { key: "ordered", label: "Pedidos", icon: ShoppingCart, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-slate-400">
            Visão geral do sistema nos últimos 30 dias
          </p>
        </div>
        <Link href="/items">
          <Button className="gap-2">
            <Package className="h-4 w-4" />
            Novo Item
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-5">
                <div className={`rounded-xl ${stat.iconBg} p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <div className={`bg-gradient-to-r ${stat.gradient} px-5 py-2`}>
                <p className="text-xs font-medium text-white/90">{stat.subtext}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance de Negociações */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-green-500/20 p-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              Performance de Negociações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">
                  {dashboard?.negotiations?.total || 0}
                </p>
                <p className="mt-1 text-sm text-slate-400">Total</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">
                  {dashboard?.negotiations?.successful || 0}
                </p>
                <p className="mt-1 text-sm text-slate-400">Bem-sucedidas</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400">
                  {successRate.toFixed(0)}%
                </p>
                <p className="mt-1 text-sm text-slate-400">Taxa de Sucesso</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progresso</span>
                <span className="text-sm font-medium text-slate-300">{successRate.toFixed(0)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                  style={{ width: `${Math.max(successRate, 5)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-yellow-500/20 p-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              Alertas
              <span className="ml-auto rounded-full bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-300">
                {alerts?.total_alerts || 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts?.alerts?.length > 0 ? (
              <div className="space-y-3">
                {alerts.alerts.slice(0, 4).map((alert: { type: string; severity: string; message: string }, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-lg p-3 ${
                      alert.severity === "warning"
                        ? "bg-yellow-500/10 border border-yellow-500/20"
                        : "bg-blue-500/10 border border-blue-500/20"
                    }`}
                  >
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                      alert.severity === "warning" ? "text-yellow-400" : "text-blue-400"
                    }`} />
                    <span className="text-sm text-slate-300">{alert.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="rounded-full bg-green-500/20 p-3 mb-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <p className="font-medium text-white">Tudo certo!</p>
                <p className="text-sm text-slate-400">Nenhum alerta no momento</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status dos Itens */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <Package className="h-5 w-5 text-blue-400" />
              </div>
              Status dos Itens
            </CardTitle>
            <Link href="/items">
              <Button variant="ghost" size="sm" className="gap-1 text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-5">
            {statusConfig.map(({ key, label, icon: Icon, color, bg }) => (
              <div
                key={key}
                className={`rounded-xl ${bg} p-4 text-center transition-transform hover:scale-105 border border-slate-700`}
              >
                <Icon className={`mx-auto h-6 w-6 ${color} mb-2`} />
                <p className="text-2xl font-bold text-white">
                  {(dashboard?.items?.by_status?.[key] as number) || 0}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/items" className="block">
          <Card className="hover:bg-slate-700/50 transition-colors cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-blue-500/20 p-3 group-hover:bg-blue-500/30 transition-colors">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Cadastrar Item</p>
                <p className="text-sm text-slate-400">Foto, descrição ou arquivo</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/suppliers" className="block">
          <Card className="hover:bg-slate-700/50 transition-colors cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-emerald-500/20 p-3 group-hover:bg-emerald-500/30 transition-colors">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Novo Fornecedor</p>
                <p className="text-sm text-slate-400">Cadastrar fornecedor</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/quotations" className="block">
          <Card className="hover:bg-slate-700/50 transition-colors cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-violet-500/20 p-3 group-hover:bg-violet-500/30 transition-colors">
                <FileText className="h-6 w-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Ver Cotações</p>
                <p className="text-sm text-slate-400">Gerenciar cotações</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
