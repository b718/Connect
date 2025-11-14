"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import "./globals.css";

export enum Role {
  Student = "student",
  Teacher = "teacher",
}

interface UserRoleContextType {
  userRole: Role | null;
  setUserRole: Dispatch<SetStateAction<Role | null>>;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userRole, setUserRole] = useState<Role | null>(Role.Student);
  const userRoleContextValue: UserRoleContextType = {
    userRole,
    setUserRole,
  };

  return (
    <UserRoleContext value={userRoleContextValue}>
      <ClerkProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </ClerkProvider>
    </UserRoleContext>
  );
}
