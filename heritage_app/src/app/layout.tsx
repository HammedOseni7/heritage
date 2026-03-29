import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { AuthProvider } from "@/theme/AuthContext";
import { HeritageProvider } from "@/theme/HeritageContext";
import MainLayout from "@/components/layout/MainLayout";
import Chatbot from "@/components/common/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heritage App | Preserve Our Culture",
  description: "A platform to share and preserve cultural heritage worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          <AuthProvider>
            <HeritageProvider>
              <MainLayout>{children}</MainLayout>
              <Chatbot />
            </HeritageProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
