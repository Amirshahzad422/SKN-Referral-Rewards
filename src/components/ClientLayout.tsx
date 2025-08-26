'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (either real user or hardcoded admin)
    const checkLoginStatus = () => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsLoggedIn(isAdmin);
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  const isLoginPage = pathname === '/login';

  if (isLoading) {
    return <>{children}</>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Only show sidebar if user is logged in
  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="lg:flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
} 