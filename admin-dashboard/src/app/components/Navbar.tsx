"use client"
import React, { useState } from 'react';
import { Layout as AntLayout, theme } from 'antd';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';
import Link from 'next/link';

const { Header } = AntLayout;

const Navbar: React.FC = () => {
  const router = useRouter();
  const { userData, clearUserData } = useAuthStore();
  const [dropDown, setDropDown] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUserData();
    router.push("/login");
  };

  const toggleDropdown = () => {
    setDropDown((prev) => !prev);
  };

  return (
    <AntLayout.Header style={{ 
      padding: "0 16px", 
      background: colorBgContainer, 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div className="text-xl font-bold">
        <Link href="/">Dashboard</Link>
      </div>
      <div className="flex items-center gap-4">
        {userData && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <span>{userData.username}</span>
            </button>
            {dropDown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AntLayout.Header>
  );
};

export default Navbar;