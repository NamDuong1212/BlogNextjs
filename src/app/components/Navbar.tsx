"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

const Navbar = () => {
  const router = useRouter();
  const { userData, clearUserData } = useAuthStore();
  const [dropDown, setDropDown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUserData();
    router.push("/login");
  };

  const toggleDropdown = () => {
    setDropDown((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Mirai
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin/post/create"
              className="text-gray-600 hover:text-gray-900"
            >
              Post
            </Link>
            <Link
              href="/post-list"
              className="text-gray-600 hover:text-gray-900"
            >
              List
            </Link>

            {userData ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Avatar shape="square" icon={<UserOutlined />} size={30} />
                  <span>{userData.username}</span>
                </button>
                {dropDown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
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
