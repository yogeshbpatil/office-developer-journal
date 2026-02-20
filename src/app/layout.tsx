import type { Metadata } from "next";
import "./globals.css";
import BootstrapClient from "./BootstrapClient";

export const metadata: Metadata = {
  title: "Developer Journal UI",
  description: "Enterprise-grade developer journal system for tracking daily work logs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
