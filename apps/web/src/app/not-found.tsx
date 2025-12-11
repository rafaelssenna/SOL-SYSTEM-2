"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Página não encontrada</p>
      <Link href="/">
        <Button variant="gradient">
          <Home className="mr-2 h-4 w-4" />
          Voltar para Home
        </Button>
      </Link>
    </div>
  );
}
