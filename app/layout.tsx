import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hexatec — Identity that survives the field",
  description: "Wearable NFC identification for defence and civil preparedness.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
