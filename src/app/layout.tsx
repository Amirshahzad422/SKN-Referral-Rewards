import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "SKN Official",
  description: "Official website of SKN",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get("skn_token")?.value);

  return (
    <html lang="en">
      <body className="antialiased">
        {hasToken ? (
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
          </div>
        ) : (
          <main className="min-h-screen bg-gray-50">{children}</main>
        )}
      </body>
    </html>
  );
}
