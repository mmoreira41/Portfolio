import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Miguel Moreira | Full-Stack Developer",
  description: "Portfolio de Miguel Moreira Chaves Maciel - Desenvolvedor Full-Stack, SaaS Builder e UI Crafter. Baseado em Belo Horizonte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
