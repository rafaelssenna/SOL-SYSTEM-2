"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 lg:flex lg:flex-col lg:justify-center lg:px-12">
        <div className="max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <Sun className="h-12 w-12 text-yellow-500" />
            <span className="text-4xl font-bold text-white">SOL</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white">
            Sistema de Otimização de Logística
          </h1>
          <p className="text-lg text-gray-300">
            IA de compras corporativas com identificação automática, negociação e rastreabilidade total.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Identificação automática por foto</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Negociação inteligente com IA</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>100% auditável e transparente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full items-center justify-center bg-slate-900 px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">SOL</span>
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white">Bem-vindo de volta</h2>
          <p className="mb-8 text-slate-400">Entre com suas credenciais para acessar o sistema</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-900/50 border border-red-500 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Não tem uma conta?{" "}
            <a href="/register" className="font-medium text-blue-400 hover:text-blue-300">
              Solicite acesso
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
