import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Qanat - Байланысқа қанат бітір!",
  description: "Қазақстандық қауіпсіз хабарласу платформасы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="kk">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
