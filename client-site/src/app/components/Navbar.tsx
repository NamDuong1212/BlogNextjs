"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Input } from "antd";
import ImageComponentAvatar from "./ImageComponentAvatar";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { userData, clearUserData } = useAuthStore();
  const [dropDown, setDropDown] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isCreator = userData?.isCreator || false;

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUserData();
    router.push("/login");
  };

  const toggleDropdown = () => {
    setDropDown((prev) => !prev);
  };

  const handleSearch = () => {
    const value = searchValue.trim();
    router.push(`/?search=${encodeURIComponent(value)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              TripTales
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4 flex gap-2">
            <Input
              placeholder="Tìm kiếm bài viết..."
              size="middle"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                const value = e.target.value.trim();
                router.push(`/?search=${encodeURIComponent(value)}`);
              }}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-4">

            {userData ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ImageComponentAvatar
                    size={50}
                    src={userData.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
                    alt="User Avatar"
                  />
                  <span>{userData.username}</span>
                </button>
                {dropDown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                    >
                      Đăng xuất
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
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                >
                  Đăng ký
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
