"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Star, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { suppliersService } from "@/services/api";
import { Supplier } from "@/types";

export default function SuppliersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    city: "",
    state: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["suppliers", search],
    queryFn: () => suppliersService.list({ search, per_page: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof newSupplier) => suppliersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setShowCreateModal(false);
      setNewSupplier({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        city: "",
        state: "",
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fornecedores</h1>
          <p className="mt-1 text-slate-400">
            Gerencie sua base de fornecedores
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Card className="border-blue-500/30 bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-white">Cadastrar Novo Fornecedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nome da Empresa *"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, email: e.target.value })
                }
              />
              <Input
                label="Telefone"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
              />
              <Input
                label="WhatsApp"
                value={newSupplier.whatsapp}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, whatsapp: e.target.value })
                }
              />
              <Input
                label="Cidade"
                value={newSupplier.city}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, city: e.target.value })
                }
              />
              <Input
                label="Estado"
                value={newSupplier.state}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, state: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => createMutation.mutate(newSupplier)}
                isLoading={createMutation.isPending}
                disabled={!newSupplier.name}
              >
                Cadastrar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar fornecedores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Suppliers Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : data?.suppliers?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.suppliers.map((supplier: Supplier) => (
            <Card key={supplier.id} className="hover:border-blue-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      {supplier.name}
                    </h3>
                    {supplier.trading_name && (
                      <p className="text-sm text-slate-400">
                        {supplier.trading_name}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={supplier.status} />
                </div>

                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(supplier.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-slate-300">
                    {supplier.rating.toFixed(1)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {(supplier.city || supplier.state) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>
                        {[supplier.city, supplier.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-4 text-xs text-slate-400">
                  <span>{supplier.total_orders} pedidos</span>
                  <span>{supplier.on_time_delivery_rate}% no prazo</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Plus className="mb-4 h-12 w-12 text-slate-500" />
            <h3 className="text-lg font-medium text-white">
              Nenhum fornecedor ainda
            </h3>
            <p className="mt-1 text-slate-400">
              Cadastre seu primeiro fornecedor
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
