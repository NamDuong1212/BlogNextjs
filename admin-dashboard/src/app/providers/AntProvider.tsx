"use client";

import { App as AntdApp, ConfigProvider } from "antd";
import { ReactNode } from "react";

interface AntProviderProps {
  children: ReactNode;
}

export default function AntProvider({ children }: AntProviderProps) {
  return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
          },
        }}
      >
        {children}
      </ConfigProvider>
  );
}
