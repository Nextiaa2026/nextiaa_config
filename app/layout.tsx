import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Toaster } from "sonner";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Website Master Admin",
  description: "Manage all your platforms from one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-foreground font-sans">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col">
            <div className="container mx-auto flex-1 px-4">
              {children}
            </div>
          </main>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
