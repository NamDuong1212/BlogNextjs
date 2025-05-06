"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";
import { UserOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import ImageComponentAvatar from "./ImageComponentAvatar";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { userData, clearUserData } = useAuthStore();
  const [dropDown, setDropDown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCreator = userData?.isCreator || false;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUserData();
    router.push("/login");
    setDropDown(false);
  };

  const toggleDropdown = () => {
    setDropDown((prev) => !prev);
  };

  const handleSearch = () => {
    const value = searchValue.trim();
    if (value) {
      router.push(`/?search=${encodeURIComponent(value)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const closeDropdown = () => {
    setDropDown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (dropDown) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          closeDropdown();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropDown]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white bg-opacity-95 backdrop-blur-sm shadow-md py-2" 
          : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                TripTales
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              title="Toggle mobile menu"
            >
              <MenuOutlined style={{ fontSize: '20px' }} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-8">
            {/* Search */}
            <div className="relative max-w-md w-full mx-4">
              <Input
                placeholder="Search posts..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="rounded-full py-2 border border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all"
                style={{ paddingLeft: '15px' }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-4 text-blue-500 hover:text-blue-700"
                title="Search"
              >
                <SearchOutlined />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              <Link href="/" className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-all">
                Home
              </Link>
              <Link href="/explore" className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-all">
                Explore
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center ml-4">
              {userData ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center">
                      <ImageComponentAvatar
                        size={40}
                        src={userData.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
                        alt="User Avatar"
                      />
                      <span className="ml-2 font-medium text-gray-700">{userData.username}</span>
                    </div>
                  </button>

                  {dropDown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-xl py-2 z-50 transform origin-top-right transition-all duration-200 ease-out">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Logged in with</p>
                        <p className="font-medium text-gray-800">{userData.email || userData.username}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <span className="flex items-center">
                          <UserOutlined className="mr-2" />
                          Profile
                        </span>
                      </Link>
                      {isCreator && (
                        <Link
                          href="/post-list"
                          onClick={closeDropdown}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <span className="flex items-center">
                            <i className="mr-2">📝</i>
                            My Posts
                          </span>
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-2 pt-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-all"
                        >
                          <span className="flex items-center">
                            <i className="mr-2">↪</i>
                            Log out
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-5 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-all font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow transition-all font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="mb-4">
              <Input
                placeholder="Search posts..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/explore"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              {userData ? (
                <>
                  <Link
                    href="/profile"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
