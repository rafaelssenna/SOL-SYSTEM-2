"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Search,
  Check,
  X,
  MessageSquare,
  Eye,
  DollarSign,
  Clock,
  Package,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { quotationsService, itemsService, suppliersService } from "@/services/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Quotation, Item, Supplier } from "@/types";

export default function QuotationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [receiveData, setReceiveData] = useState({
    unit_price: "",
    quantity: "1",
    shipping_cost: "0",
    delivery_days: "7",
    payment_terms: "",
    payment_method: "",
    warranty_months: "0",
    product_name: "",
    product_brand: "",
    product_model: "",
    is_original: true,
    is_substitute: false,
    validity_days: "7",
  });

  const { data: quotationsData, isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: () => quotationsService.list({ per_page: 100 }),
  });

  const { data: itemsData } = useQuery({
    queryKey: ["items-all"],
    queryFn: () => itemsService.list({ per_page: 100 }),
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers-all"],
    queryFn: () => suppliersService.list({ per_page: 100 }),
  });

  const acceptMutation = useMutation({
    mutationFn: (id: number) => quotationsService.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => quotationsService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });

  const receiveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      quotationsService.receive(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setShowReceiveModal(false);
      setSelectedQuotation(null);
    },
  });

  const getItem = (itemId: number): Item | undefined => {
    return itemsData?.items?.find((i: Item) => i.id === itemId);
  };

  const getSupplier = (supplierId: number): Supplier | undefined => {
    return suppliersData?.suppliers?.find((s: Supplier) => s.id === supplierId);
  };

  const handleReceive = () => {
    if (!selectedQuotation) return;
    receiveMutation.mutate({
      id: selectedQuotation.id,
      data: {
        unit_price: parseFloat(receiveData.unit_price),
        quantity: parseInt(receiveData.quantity),
        shipping_cost: parseFloat(receiveData.shipping_cost) || 0,
        delivery_days: parseInt(receiveData.delivery_days) || 7,
        payment_terms: receiveData.payment_terms || undefined,
        payment_method: receiveData.payment_method || undefined,
        warranty_months: parseInt(receiveData.warranty_months) || 0,
        product_name: receiveData.product_name || undefined,
        product_brand: receiveData.product_brand || undefined,
        product_model: receiveData.product_model || undefined,
        is_original: receiveData.is_original,
        is_substitute: receiveData.is_substitute,
        validity_days: parseInt(receiveData.validity_days) || 7,
      },
    });
  };

  const filteredQuotations = quotationsData?.quotations?.filter((q: Quotation) => {
    if (!search) return true;
    const item = getItem(q.item_id);
    const supplier = getSupplier(q.supplier_id);
    const searchLower = search.toLowerCase();
    return (
      item?.name?.toLowerCase().includes(searchLower) ||
      supplier?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Cotações</h1>
        <p className="mt-1 text-slate-400">
          Gerencie as cotações recebidas dos fornecedores
        </p>
      </div>

      {/* Receive Modal */}
      {showReceiveModal && selectedQuotation && (
        <Card className="border-green-500/30 bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5 text-green-400" />
              Registrar Cotação Recebida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Preço Unitário *"
                type="number"
                step="0.01"
                value={receiveData.unit_price}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, unit_price: e.target.value })
                }
              />
              <Input
                label="Quantidade"
                type="number"
                value={receiveData.quantity}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, quantity: e.target.value })
                }
              />
              <Input
                label="Frete (R$)"
                type="number"
                step="0.01"
                value={receiveData.shipping_cost}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, shipping_cost: e.target.value })
                }
              />
              <Input
                label="Prazo de Entrega (dias)"
                type="number"
                value={receiveData.delivery_days}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, delivery_days: e.target.value })
                }
              />
              <Input
                label="Condições de Pagamento"
                value={receiveData.payment_terms}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, payment_terms: e.target.value })
                }
                placeholder="Ex: 30/60/90 dias"
              />
              <Input
                label="Garantia (meses)"
                type="number"
                value={receiveData.warranty_months}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, warranty_months: e.target.value })
                }
              />
              <Input
                label="Nome do Produto"
                value={receiveData.product_name}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, product_name: e.target.value })
                }
              />
              <Input
                label="Marca"
                value={receiveData.product_brand}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, product_brand: e.target.value })
                }
              />
              <Input
                label="Modelo"
                value={receiveData.product_model}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, product_model: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={receiveData.is_original}
                  onChange={(e) =>
                    setReceiveData({ ...receiveData, is_original: e.target.checked })
                  }
                  className="rounded border-slate-500 bg-slate-600"
                />
                <span className="text-sm text-slate-300">Produto Original</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={receiveData.is_substitute}
                  onChange={(e) =>
                    setReceiveData({ ...receiveData, is_substitute: e.target.checked })
                  }
                  className="rounded border-slate-500 bg-slate-600"
                />
                <span className="text-sm text-slate-300">Produto Substituto</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleReceive}
                isLoading={receiveMutation.isPending}
                disabled={!receiveData.unit_price}
              >
                Salvar Cotação
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReceiveModal(false);
                  setSelectedQuotation(null);
                }}
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
          placeholder="Buscar cotações por item ou fornecedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quotations List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : filteredQuotations?.length > 0 ? (
        <div className="grid gap-4">
          {filteredQuotations.map((quotation: Quotation) => {
            const item = getItem(quotation.item_id);
            const supplier = getSupplier(quotation.supplier_id);

            return (
              <Card key={quotation.id} className="hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">
                          {item?.name || `Item #${quotation.item_id}`}
                        </h3>
                        <StatusBadge status={quotation.status} />
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-300">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          {supplier?.name || `Fornecedor #${quotation.supplier_id}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-slate-400" />
                          Qtd: {quotation.quantity}
                        </span>
                        {quotation.delivery_days && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {quotation.delivery_days} dias
                          </span>
                        )}
                      </div>

                      {quotation.final_price && (
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-lg font-bold text-green-400">
                            {formatCurrency(quotation.final_price)}
                          </span>
                          {quotation.unit_price && (
                            <span className="text-sm text-slate-400">
                              ({formatCurrency(quotation.unit_price)} / un)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-slate-400">
                        {formatDate(quotation.created_at)}
                      </span>

                      <div className="flex gap-2">
                        {quotation.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedQuotation(quotation);
                              setShowReceiveModal(true);
                            }}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Registrar
                          </Button>
                        )}

                        {quotation.status === "received" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => acceptMutation.mutate(quotation.id)}
                              isLoading={acceptMutation.isPending}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Aceitar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectMutation.mutate(quotation.id)}
                              isLoading={rejectMutation.isPending}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Rejeitar
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Negociar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <FileText className="mb-4 h-12 w-12 text-slate-500" />
            <h3 className="text-lg font-medium text-white">
              Nenhuma cotação ainda
            </h3>
            <p className="mt-1 text-slate-400">
              Solicite cotações na página de Itens
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
