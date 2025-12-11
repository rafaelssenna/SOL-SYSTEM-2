import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOL - Sistema de Otimização de Logística",
  description:
    "Plataforma inteligente de compras corporativas com IA. Identificação automática, negociação, e rastreabilidade total.",
  keywords: [
    "compras corporativas",
    "IA",
    "otimização",
    "procurement",
    "negociação automática",
  ],
  authors: [{ name: "SOL System" }],
  creator: "SOL System",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://sol-system.com",
    title: "SOL - Sistema de Otimização de Logística",
    description: "IA de compras corporativas com identificação automática e negociação",
    siteName: "SOL System",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
