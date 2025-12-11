"use client";

import { useState } from "react";
import { Search, MapPin, Phone, Globe, Store, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { webSearchService } from "@/services/api";

interface LocalSupplier {
  name: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  website?: string;
  description?: string;
  has_exact_product?: boolean;
  distance_info?: string;
  estimated_price?: number;
  source_url?: string;
}

interface OnlineOption {
  seller: string;
  marketplace?: string;
  price: number;
  shipping_cost?: number;
  shipping_time?: string;
  url?: string;
  seller_rating?: string;
  is_official_store?: boolean;
}

interface SearchResult {
  success: boolean;
  product: string;
  client_location?: string;
  local_suppliers?: LocalSupplier[];
  online_options?: OnlineOption[];
  recommendation?: {
    best_local?: string;
    best_online?: string;
    best_overall?: string;
    suggested_action?: string;
  };
  price_analysis?: {
    lowest_local?: number;
    lowest_online?: number;
    price_difference?: string;
  };
  search_summary?: string;
  error?: string;
}

export default function SearchPage() {
  const [productDescription, setProductDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [budget, setBudget] = useState("");
  const [urgency, setUrgency] = useState<"urgent" | "normal" | "flexible">("normal");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!productDescription || !city || !state) {
      setError("Preencha o produto, cidade e estado");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await webSearchService.smartSupplierSearch({
        product_description: productDescription,
        client_city: city,
        client_state: state,
        budget: budget ? parseFloat(budget) : undefined,
        urgency,
        prefer_local: true,
      });

      setResult(response);
    } catch (err) {
      console.error("Erro na busca:", err);
      setError("Erro ao realizar busca. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Busca Inteligente de Fornecedores</h1>
        <p className="text-gray-400 mt-1">
          Encontre fornecedores locais e online que vendem o produto que você precisa
        </p>
      </div>

      {/* Formulário de Busca */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Nova Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Produto *
            </label>
            <Input
              placeholder="Ex: Rolamento 6205 2RS, Motor elétrico 3CV WEG, iPhone 15..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Localização */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cidade *
              </label>
              <Input
                placeholder="Ex: São Paulo"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Estado *
              </label>
              <Input
                placeholder="Ex: SP"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Opções adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Orçamento máximo (opcional)
              </label>
              <Input
                type="number"
                placeholder="Ex: 500.00"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Urgência
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as typeof urgency)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="urgent">Urgente (preciso hoje/amanhã)</option>
                <option value="normal">Normal (pode aguardar 3-5 dias)</option>
                <option value="flexible">Flexível (busco menor preço)</option>
              </select>
            </div>
          </div>

          {/* Botão de busca */}
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando fornecedores...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar Fornecedores
              </>
            )}
          </Button>

          {/* Erro */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {result && (
        <div className="space-y-6">
          {/* Resumo */}
          {result.search_summary && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-gray-300">{result.search_summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Recomendação */}
          {result.recommendation && (
            <Card className="bg-green-900/30 border-green-700">
              <CardHeader>
                <CardTitle className="text-green-400">Recomendação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.recommendation.best_overall && (
                  <p className="text-white font-medium">
                    {result.recommendation.best_overall}
                  </p>
                )}
                {result.recommendation.suggested_action && (
                  <p className="text-gray-300">
                    <strong>Próximo passo:</strong> {result.recommendation.suggested_action}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fornecedores Locais */}
          {result.local_suppliers && result.local_suppliers.length > 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-400" />
                  Fornecedores Locais ({result.local_suppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {result.local_suppliers.map((supplier, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/50 p-4 rounded-lg border border-slate-600"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{supplier.name}</h3>
                          {supplier.description && (
                            <p className="text-gray-400 text-sm mt-1">
                              {supplier.description}
                            </p>
                          )}
                        </div>
                        {supplier.has_exact_product && (
                          <Badge variant="success">Produto exato</Badge>
                        )}
                      </div>

                      <div className="mt-3 space-y-2">
                        {supplier.phone && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone className="h-4 w-4 text-green-400" />
                            <a
                              href={`tel:${supplier.phone}`}
                              className="hover:text-blue-400"
                            >
                              {supplier.phone}
                            </a>
                            {supplier.whatsapp && (
                              <a
                                href={`https://wa.me/55${supplier.whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 text-sm"
                              >
                                (WhatsApp)
                              </a>
                            )}
                          </div>
                        )}

                        {supplier.address && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="h-4 w-4 text-red-400" />
                            <span>{supplier.address}</span>
                          </div>
                        )}

                        {supplier.website && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Globe className="h-4 w-4 text-blue-400" />
                            <a
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-400"
                            >
                              {supplier.website}
                            </a>
                          </div>
                        )}

                        {supplier.distance_info && (
                          <p className="text-gray-500 text-sm">
                            {supplier.distance_info}
                          </p>
                        )}

                        {supplier.estimated_price && (
                          <p className="text-green-400 font-medium">
                            Preço estimado: R$ {supplier.estimated_price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Opções Online */}
          {result.online_options && result.online_options.length > 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-purple-400" />
                  Opções Online ({result.online_options.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {result.online_options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/50 p-4 rounded-lg border border-slate-600"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{option.seller}</h3>
                          {option.marketplace && (
                            <p className="text-gray-400 text-sm">{option.marketplace}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg">
                            R$ {option.price.toFixed(2)}
                          </p>
                          {option.shipping_cost !== undefined && (
                            <p className="text-gray-400 text-sm">
                              + Frete: R$ {option.shipping_cost.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {option.shipping_time && (
                          <Badge variant="outline">{option.shipping_time}</Badge>
                        )}
                        {option.seller_rating && (
                          <Badge variant="outline">Avaliação: {option.seller_rating}</Badge>
                        )}
                        {option.is_official_store && (
                          <Badge variant="success">Loja Oficial</Badge>
                        )}
                      </div>

                      {option.url && (
                        <a
                          href={option.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Ver produto →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Análise de Preços */}
          {result.price_analysis && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Análise de Preços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.price_analysis.lowest_local && (
                    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Menor preço local</p>
                      <p className="text-2xl font-bold text-blue-400">
                        R$ {result.price_analysis.lowest_local.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {result.price_analysis.lowest_online && (
                    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Menor preço online</p>
                      <p className="text-2xl font-bold text-purple-400">
                        R$ {result.price_analysis.lowest_online.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {result.price_analysis.price_difference && (
                    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Diferença</p>
                      <p className="text-sm text-gray-300">
                        {result.price_analysis.price_difference}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sem resultados */}
          {(!result.local_suppliers || result.local_suppliers.length === 0) &&
            (!result.online_options || result.online_options.length === 0) && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">
                    Nenhum fornecedor encontrado
                  </h3>
                  <p className="text-gray-400">
                    Tente descrever o produto de outra forma ou ampliar a região de busca.
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      )}
    </div>
  );
}
