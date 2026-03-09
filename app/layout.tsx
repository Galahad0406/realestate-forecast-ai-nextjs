import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Real Estate Forecast",
  description: "Advanced 5-Year Price Prediction Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
