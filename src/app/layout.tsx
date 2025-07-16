import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SessionDebugger from "@/components/SessionDebugger";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Interview Coder - AI for Leetcode Interviews",
  description: "Nail your technical interviews with real-time AI assistance. The ultimate AI assistant for technical interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-roboto antialiased`}>
        <AuthProvider>
          {children}
          <SessionDebugger />
        </AuthProvider>
      </body>
    </html>
  );
}
