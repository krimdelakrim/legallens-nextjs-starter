import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LegalLens Research App",
  description: "Private litigation research and pleading analysis workspace"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
