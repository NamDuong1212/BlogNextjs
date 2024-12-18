"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import AntProvider from "./AntProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AntProvider>
        {children}
        <ToastContainer />
      </AntProvider>
    </QueryProvider>
  );
}
