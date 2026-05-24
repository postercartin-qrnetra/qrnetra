import { AppProviders } from "@/components/providers/app-providers";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QRNetra — Privacy-first QR safety tags",
    template: "%s · QRNetra",
  },
  description:
    "Privacy-first emergency contact for vehicles, kids, and pets — dynamic QR codes without exposing your phone number.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-qn-bg text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
