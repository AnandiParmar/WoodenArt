import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { ConditionalNavbar } from "@/components/conditional-navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wooden Art - Crafting Digital Excellence",
  description: "Experience the perfect blend of traditional craftsmanship and modern digital innovation. Beautiful animations and warm earthy design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ReduxProvider>
            <ConditionalNavbar />
            {children}
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
