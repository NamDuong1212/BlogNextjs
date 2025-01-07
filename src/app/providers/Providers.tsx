"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import AntProvider from "./AntProvider";
import { Toaster, ToastOptions } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

const toastOptions: ToastOptions = {
  duration: 3000,
  position: "top-center",
  style: {
    background: "white",
    color: "black",
  },
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AntProvider>
        {children}
        <Toaster toastOptions={toastOptions} />
      </AntProvider>
    </QueryProvider>
  );
}
