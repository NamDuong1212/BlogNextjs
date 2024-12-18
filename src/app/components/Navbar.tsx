"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

const Navbar = () => {
  const router = useRouter();
  const { userData, clearUserData } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUserData();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Mirai
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>

            {userData ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <Avatar
                    shape="square"
                    icon={<UserOutlined />}
                    className="mr-2"
                    size={30}
                  />
                  {userData.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-900"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
