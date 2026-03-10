import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { UserIdContextProvider } from "./_shared/user-id/UserIdContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connect",
  description: "Making the lives of teachers easier one test at a time.",
  icons: {
    icon: "connect.png",
    apple: "connect.png",
    shortcut: "connect.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body>
          <UserIdContextProvider>{children}</UserIdContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
