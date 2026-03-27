import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardLayoutWrapper from "@/components/layout/dashboard-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My-Panel | All-in-one App Management",
  description: "Modern application management platform for VPS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DashboardLayoutWrapper>
            {children}
          </DashboardLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
