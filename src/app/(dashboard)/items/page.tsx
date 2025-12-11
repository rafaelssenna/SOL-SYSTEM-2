"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Camera,
  FileText,
  MessageSquare,
  Send,
  X,
  Trash2,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { itemsService, suppliersService, quotationsService } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Item, Supplier } from "@/types";

type CreateMode = "photo" | "description" | "file" | null;

export default function ItemsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [additionalContext, setAdditionalContext] = useState("");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["items", search],
    queryFn: () => itemsService.list({ search, per_page: 50 }),
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => suppliersService.list({ per_page: 100, status: "active" }),
  });

  const createFromPhotoMutation = useMutation({
    mutationFn: (file: File) =>
      itemsService.createFromPhoto(file, {
        additional_context: additionalContext || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setCreateMode(null);
      setSelectedFile(null);
      setAdditionalContext("");
    },
  });

  const createFromDescriptionMutation = useMutation({
    mutationFn: (desc: string) =>
      itemsService.createFromDescription({ description: desc }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setCreateMode(null);
      setDescription("");
    },
  });

  const createFromFileMutation = useMutation({
    mutationFn: (file: File) => itemsService.createFromFile(file, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setCreateMode(null);
      setSelectedFile(null);
    },
  });

  const requestQuotationMutation = useMutation({
    mutationFn: ({ itemId, supplierIds }: { itemId: number; supplierIds: number[] }) =>
      quotationsService.request(itemId, supplierIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setShowQuoteModal(false);
      setSelectedItem(null);
      setSelectedSuppliers([]);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => itemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handleCreate = () => {
    if (createMode === "photo" && selectedFile) {
      createFromPhotoMutation.mutate(selectedFile);
    } else if (createMode === "description" && description) {
      createFromDescriptionMutation.mutate(description);
    } else if (createMode === "file" && selectedFile) {
      createFromFileMutation.mutate(selectedFile);
    }
  };

  const handleRequestQuotation = () => {
    if (selectedItem && selectedSuppliers.length > 0) {
      requestQuotationMutation.mutate({
        itemId: selectedItem.id,
        supplierIds: selectedSuppliers,
      });
    }
  };

  const toggleSupplier = (supplierId: number) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const isCreating =
    createFromPhotoMutation.isPending ||
    createFromDescriptionMutation.isPending ||
    createFromFileMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Itens</h1>
          <p className="mt-1 text-slate-400">
            Gerencie itens para cotação e compra
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCreateMode("photo")}
            className="gap-2"
          >
            <Camera className="h-4 w-4" />
            Foto
          </Button>
          <Button
            variant="outline"
            onClick={() => setCreateMode("description")}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Descrição
          </Button>
          <Button
            variant="outline"
            onClick={() => setCreateMode("file")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Arquivo
          </Button>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && selectedItem && (
        <Card className="border-green-500/30 bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5 text-green-400" />
                Solicitar Cotações - {selectedItem.name || "Item"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowQuoteModal(false);
                  setSelectedItem(null);
                  setSelectedSuppliers([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Selecione os fornecedores para enviar a solicitação de cotação:
            </p>

            {suppliersData?.suppliers?.length > 0 ? (
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {suppliersData.suppliers.map((supplier: Supplier) => (
                  <label
                    key={supplier.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedSuppliers.includes(supplier.id)
                        ? "border-green-500 bg-green-900/50"
                        : "border-slate-600 bg-slate-700 hover:border-green-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.includes(supplier.id)}
                      onChange={() => toggleSupplier(supplier.id)}
                      className="h-4 w-4 rounded border-slate-500 bg-slate-600 text-green-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{supplier.name}</p>
                      <p className="text-sm text-slate-400">
                        {supplier.email || supplier.phone || "Sem contato"}
                        {supplier.whatsapp && " • WhatsApp disponível"}
                      </p>
                    </div>
                    <div className="text-sm text-yellow-400">
                      {supplier.rating.toFixed(1)} ★
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Nenhum fornecedor cadastrado. Cadastre fornecedores primeiro.
              </p>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleRequestQuotation}
                isLoading={requestQuotationMutation.isPending}
                disabled={selectedSuppliers.length === 0}
              >
                Enviar para {selectedSuppliers.length} fornecedor(es)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuoteModal(false);
                  setSelectedItem(null);
                  setSelectedSuppliers([]);
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Mode Modal */}
      {createMode && (
        <Card className="border-blue-500/30 bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {createMode === "photo" && (
                <>
                  <Camera className="h-5 w-5 text-blue-400" />
                  Identificar por Foto
                </>
              )}
              {createMode === "description" && (
                <>
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  Descrever Item
                </>
              )}
              {createMode === "file" && (
                <>
                  <FileText className="h-5 w-5 text-blue-400" />
                  Enviar Arquivo
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {createMode === "photo" && (
              <>
                <FileUpload
                  accept="image/*"
                  onFileSelect={setSelectedFile}
                  maxSize={10}
                />
                <Input
                  label="Contexto adicional (opcional)"
                  placeholder="Ex: Peça de motor BMW, rosca M10..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                />
              </>
            )}

            {createMode === "description" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Descreva o que você precisa
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  rows={4}
                  placeholder="Ex: Rolamento de esferas 6205, marca SKF ou similar, para motor elétrico..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}

            {createMode === "file" && (
              <FileUpload
                accept=".pdf,image/*"
                onFileSelect={setSelectedFile}
                maxSize={10}
              />
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                isLoading={isCreating}
                disabled={
                  (createMode === "photo" && !selectedFile) ||
                  (createMode === "description" && !description) ||
                  (createMode === "file" && !selectedFile)
                }
              >
                {isCreating ? "Identificando com IA..." : "Identificar Item"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateMode(null);
                  setSelectedFile(null);
                  setDescription("");
                  setAdditionalContext("");
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
          placeholder="Buscar itens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : data?.items?.length > 0 ? (
        <div className="grid gap-4">
          {data.items.map((item: Item) => (
            <Card key={item.id} className="hover:border-blue-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">
                        {item.name || "Item não identificado"}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.original_description || "Sem descrição"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
                      {item.brand && (
                        <span>
                          <strong className="text-slate-400">Marca:</strong> {item.brand}
                        </span>
                      )}
                      {item.model && (
                        <span>
                          <strong className="text-slate-400">Modelo:</strong> {item.model}
                        </span>
                      )}
                      {item.category && (
                        <span>
                          <strong className="text-slate-400">Categoria:</strong> {item.category}
                        </span>
                      )}
                      <span>
                        <strong className="text-slate-400">Qtd:</strong> {item.quantity} {item.unit}
                      </span>
                    </div>
                    {item.ai_confidence && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          Confiança da IA:
                        </span>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${item.ai_confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-white">
                          {(item.ai_confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right text-sm text-slate-400">
                      <p>{formatDate(item.created_at)}</p>
                      <p className="capitalize">{item.source}</p>
                    </div>
                    <div className="flex gap-2">
                      {(item.status === "pending" || item.status === "identified") && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowQuoteModal(true);
                          }}
                          className="gap-1"
                        >
                          <Send className="h-3 w-3" />
                          Cotar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteItemMutation.mutate(item.id)}
                        isLoading={deleteItemMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
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
              Nenhum item ainda
            </h3>
            <p className="mt-1 text-slate-400">
              Comece enviando uma foto, descrição ou arquivo
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
