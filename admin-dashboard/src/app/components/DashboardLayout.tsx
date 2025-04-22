"use client";
import React from "react";
import { Layout, theme } from "antd";
import LeftBar from "./LeftBar";
import Navbar from "./Navbar";

const { Content, Footer } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <LeftBar />
      <Layout>
        <Navbar />
        <Content style={{ margin: "24px 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 750,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          TripTale ©{new Date().getFullYear()} Created by VJU
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
