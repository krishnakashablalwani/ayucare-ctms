import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AyuCare-CTMS | Clinical Trial Management System — Ministry of Ayush",
  description:
    "AyuCare-CTMS: Real-time, GCP-compliant Clinical Trial Management System for Ayurveda research, with CDISC/FHIR interoperability, role-based KPIs, and integrated NPvCC pharmacovigilance tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sohne antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
