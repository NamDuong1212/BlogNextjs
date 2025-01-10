"use client"
import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  AlibabaOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/navigation';
const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Categories', '1', <PieChartOutlined />),
  getItem('Daily Wallet', '2', <DesktopOutlined />),
  getItem('Posts', '3', <AlibabaOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '4'),
    getItem('Bill', '5'),
    getItem('Alex', '6'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const LeftBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleClick = (e: any) => {
    switch (e.key) {
      case '1':
        router.push('/category');
        break;
      case '2':
        router.push('/wallet-daily');
        break;
      case '3':
        router.push('/post');
        break;
      case '4':
        router.push('');
        break;
      case '5':
        router.push('');
        break;
      case '6':
        router.push('');
        break;
      case '8':
        router.push('');
        break;
      case '9':
        router.push('');
        break;
      default:
        router.push('/');
        break;
    }
  };
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleClick} />
    </Sider>
  );
};

export default LeftBar;
