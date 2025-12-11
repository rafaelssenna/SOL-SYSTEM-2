"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  MessageSquare,
  Save,
  Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    quotations: true,
    negotiations: true,
    orders: true,
  });

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "integrations", label: "Integrações", icon: MessageSquare },
    { id: "security", label: "Segurança", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="mt-1 text-slate-400">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-blue-400" />
                  Informações do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nome"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                  <Input
                    label="Telefone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                  <Input
                    label="Departamento"
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({ ...profileData, department: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-2xl font-bold text-blue-400">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Canais de Notificação</h3>
                  <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/50 p-4 cursor-pointer hover:bg-slate-700">
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-sm text-slate-400">
                        Receber notificações por email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) =>
                        setNotifications({ ...notifications, email: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-slate-500 bg-slate-600"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/50 p-4 cursor-pointer hover:bg-slate-700">
                    <div>
                      <p className="font-medium text-white">WhatsApp</p>
                      <p className="text-sm text-slate-400">
                        Receber notificações por WhatsApp
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.whatsapp}
                      onChange={(e) =>
                        setNotifications({ ...notifications, whatsapp: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-slate-500 bg-slate-600"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-white">Tipos de Notificação</h3>
                  <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/50 p-4 cursor-pointer hover:bg-slate-700">
                    <div>
                      <p className="font-medium text-white">Cotações</p>
                      <p className="text-sm text-slate-400">
                        Novas cotações recebidas
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.quotations}
                      onChange={(e) =>
                        setNotifications({ ...notifications, quotations: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-slate-500 bg-slate-600"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/50 p-4 cursor-pointer hover:bg-slate-700">
                    <div>
                      <p className="font-medium text-white">Negociações</p>
                      <p className="text-sm text-slate-400">
                        Atualizações de negociações
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.negotiations}
                      onChange={(e) =>
                        setNotifications({ ...notifications, negotiations: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-slate-500 bg-slate-600"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/50 p-4 cursor-pointer hover:bg-slate-700">
                    <div>
                      <p className="font-medium text-white">Pedidos</p>
                      <p className="text-sm text-slate-400">
                        Status de pedidos e entregas
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.orders}
                      onChange={(e) =>
                        setNotifications({ ...notifications, orders: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-slate-500 bg-slate-600"
                    />
                  </label>
                </div>

                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5 text-green-400" />
                  Integrações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-slate-700 bg-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                        <MessageSquare className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">WhatsApp (UAZAPI)</p>
                        <p className="text-sm text-slate-400">
                          Integração para envio de mensagens automáticas
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-medium text-yellow-400">
                      Configurar
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                        <Palette className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">OpenAI GPT-4</p>
                        <p className="text-sm text-slate-400">
                          IA para identificação e negociação
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400">
                      Conectado
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mt-4">
                  As chaves de API são configuradas nas variáveis de ambiente do servidor.
                  Entre em contato com o administrador para alterações.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-red-400" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Alterar Senha</h3>
                  <Input
                    label="Senha Atual"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="Nova Senha"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Button className="gap-2">
                    <Key className="h-4 w-4" />
                    Alterar Senha
                  </Button>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h3 className="font-medium text-white mb-4">Sessões Ativas</h3>
                  <div className="rounded-lg border border-slate-700 bg-slate-700/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Sessão Atual</p>
                        <p className="text-sm text-slate-400">
                          Navegador Web - Ativo agora
                        </p>
                      </div>
                      <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400">
                        Atual
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
