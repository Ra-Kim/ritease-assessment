import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ToastProvider from "@/components/ToastProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ritease Assessment",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="/nutrient-viewer/nutrient-viewer.js"
          // Load before the page becomes interactive to reference window.NutrientViewer in the client
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <ToastProvider />
        <SpeedInsights />
        <Analytics />
        <div className="grid lg:grid-cols-[200px_1fr] h-screen">
          <Sidebar />
          <div className="grid grid-rows-[60px_1fr] ">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
