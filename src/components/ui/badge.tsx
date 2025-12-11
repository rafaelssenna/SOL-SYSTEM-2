"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-blue-100 text-blue-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-cyan-100 text-cyan-800",
        purple: "bg-purple-100 text-purple-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Status badge helper
const statusVariants: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
  pending: "warning",
  identified: "info",
  searching: "info",
  quoting: "primary",
  negotiating: "purple",
  quoted: "primary",
  approved: "success",
  ordered: "success",
  delivered: "success",
  cancelled: "danger",
  active: "success",
  inactive: "default",
  blocked: "danger",
  pending_approval: "warning",
  received: "info",
  accepted: "success",
  rejected: "danger",
  expired: "warning",
  waiting_response: "warning",
  counter_offer: "purple",
  success: "success",
  failed: "danger",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  identified: "Identificado",
  searching: "Buscando",
  quoting: "Em Cotação",
  negotiating: "Negociando",
  quoted: "Cotado",
  approved: "Aprovado",
  ordered: "Pedido",
  delivered: "Entregue",
  cancelled: "Cancelado",
  active: "Ativo",
  inactive: "Inativo",
  blocked: "Bloqueado",
  pending_approval: "Aguardando Aprovação",
  received: "Recebida",
  accepted: "Aceita",
  rejected: "Rejeitada",
  expired: "Expirada",
  waiting_response: "Aguardando",
  counter_offer: "Contra-proposta",
  success: "Sucesso",
  failed: "Falhou",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariants[status] || "default"}>
      {statusLabels[status] || status}
    </Badge>
  );
}

export { Badge, badgeVariants };
