"use client";

import "@/app/globals.css";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@radix-ui/themes/styles.css";
import { Header } from "@/components/shared/header";
import { Toaster } from "@/components/ui/toaster";
import { KeyDialog } from "@/components/shared/key-dialog";
import { Footer } from "@/components/shared/footer";
import { WalletUiContext } from "@/utils/store/wallet.store";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <WalletUiContext>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <KeyDialog />
            <Toaster />
          </div>
        </WalletUiContext>
      </body>
    </html>
  );
}
