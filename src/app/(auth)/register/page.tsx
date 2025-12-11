"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department || undefined,
        phone: formData.phone || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Erro ao criar conta");
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
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex w-full items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">SOL</span>
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">Criar conta</h2>
          <p className="mb-8 text-gray-600">Preencha os dados para solicitar acesso</p>

          {success ? (
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <h3 className="text-lg font-medium text-green-800">Conta criada com sucesso!</h3>
              <p className="mt-2 text-green-600">Redirecionando para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Input
                label="Nome completo"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Confirmar senha"
                  name="confirmPassword"
                  type="password"
                  placeholder="******"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Departamento (opcional)"
                name="department"
                placeholder="Ex: Compras, Manutenção..."
                value={formData.department}
                onChange={handleChange}
              />

              <Input
                label="Telefone (opcional)"
                name="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleChange}
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Criar conta
              </Button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
