import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const poppins = Poppins({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nextiaa Admin",
  description: "Manage all your platforms from one place",
  icons: { icon: "/brand/nextiaa-icon.png" },
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
      <body className="min-h-full bg-white text-foreground text-sm font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
