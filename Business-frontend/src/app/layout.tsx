import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business management — Business operations platform",
  description: "Customers, products, and orders in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--surface-0)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
