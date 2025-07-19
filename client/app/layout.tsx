import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
