import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { inter } from '@/app/ui/fonts'
import { integralCF, satoshi } from '@/app/ui/fonts'
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// const geistPoppins = localFont({
//   src: "./fonts/Poppins-Regular.ttf",
//   variable: "--font-geist-poppins",
//   weight: "100 900",
// });

// const geistIntergralCFReg = localFont({
//   src: "./fonts/IntegralCF-Bold.otf",
//   variable: "--font-geist-IntegralCFR",
//   weight: "100 900",
// });

// const geistSatoshi = localFont({
//   src: "./fonts/Satoshi-Bold.otf",
//   variable: "--font-geist-Satoshi",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "MARLIN STORE | 🦋 | OFFICIAL",
  description: "BY MERCHANTSONS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${integralCF.className} ${satoshi.className} antialiased`} > 
        {children}
        <Footer/>
      </body>
    </html>
  );
}
