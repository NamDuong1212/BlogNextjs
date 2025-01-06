"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import AntProvider from "./AntProvider";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AntProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 1000,
            style: {
              background: "white",
              color: "black",
            },
          }}
        />
      </AntProvider>
    </QueryProvider>
  );
}
