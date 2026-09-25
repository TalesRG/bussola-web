import type { Metadata, Viewport } from "next";
import { Krub, Roboto } from "next/font/google";
import { AppProvider } from "./_lib/state";
import "./globals.css";
import { RoutineProvider } from "./rotina/_lib/state";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const krub = Krub({
  variable: "--font-krub",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Bússola",
  description: "Bem-estar estudantil · UnB",
};

export const viewport: Viewport = {
  themeColor: "#2f6bd8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${roboto.variable} ${krub.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Estado do protótipo compartilhado entre agenda, Home e notificações. */}
        <AppProvider>
          <RoutineProvider>{children}</RoutineProvider>
        </AppProvider>
      </body>
    </html>
  );
}
