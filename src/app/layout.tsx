import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GuitarFlow",
  description: "Diatonic harmony assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0A0A0A] text-white antialiased">
        {children}
      </body>
    </html>
  );
}