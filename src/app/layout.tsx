"use client";

import "./globals.css";
import { turnkeyConfig } from "@/config/turnkeyClient";
import { TurnkeyProvider } from "@turnkey/sdk-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100">
        <TurnkeyProvider config={turnkeyConfig}>{children}</TurnkeyProvider>
      </body>
    </html>
  );
}
