"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "../store/useAuthStore";

const publicPaths = ["/login", "/signup"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPublicPath = publicPaths.includes(pathname);

    if (!token && !isPublicPath) {
      router.push("/login");
    } else if (token && isPublicPath) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [userData, pathname, router]);

  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
