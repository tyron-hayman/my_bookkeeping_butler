import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/HeaderComponent";
import { TransitionProvider } from "@/contexts/PageTransition";
import type { Viewport } from "next";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
  weight: ["100", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "MYBPlus - AI Assited Budget",
  description:
    "Your ultimate tool for financial mastery. Offering personalized insights and recommendations to optimize spending and reach your financial goals faster.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <TransitionProvider>
          <Header />
          {children}
        </TransitionProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
