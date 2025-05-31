"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";
import { UserOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import ImageComponentAvatar from "./ImageComponentAvatar";
import NotificationDropdown from "./NotificationComponent";
import { usePost } from "../hooks/usePost"; // Import your custom hook

const Navbar: React.FC = () => {
  const router = useRouter();
  const { userData, clearUserData } = useAuthStore();
  const [dropDown, setDropDown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const { useSearchPosts } = usePost();

  const isCreator = userData?.isCreator || false;

  // Search posts with debounced query
  const { data: searchResults, isLoading: isSearchLoading } = useSearchPosts(
    searchQuery,
    1,
    8, // Limit results in dropdown
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        setSearchQuery(searchValue.trim());
        setShowSearchResults(true);
      } else {
        setSearchQuery("");
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setMobileSearchOpen(false);
      }
    };

    if (showSearchResults || mobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSearchResults, mobileSearchOpen]);

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
      setShowSearchResults(false);
      setMobileSearchOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
    if (event.key === "Escape") {
      setShowSearchResults(false);
      setMobileSearchOpen(false);
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
    setShowSearchResults(false);
    setMobileSearchOpen(false);
    setSearchValue("");
  };

  const closeDropdown = () => {
    setDropDown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (dropDown) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          closeDropdown();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropDown]);

  // Search Results Component (reusable for both desktop and mobile)
  const SearchResults = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`${isMobile ? "mt-2" : "absolute top-full left-0 right-0 mt-2"} bg-white rounded-lg border border-gray-200 shadow-xl z-50 max-h-96 overflow-y-auto`}
    >
      {isSearchLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Searching...</p>
        </div>
      ) : searchResults?.data?.length > 0 ? (
        <div className="py-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Search Results
          </div>
          {searchResults.data.map((post: any) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                {post.images && post.images[0] && (
                  <div className="flex-shrink-0">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    By {post.author} • {post.category?.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {searchResults.data.length === 8 && (
            <div className="px-3 py-2 text-center border-t border-gray-100">
              <button
                onClick={handleSearch}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all results
              </button>
            </div>
          )}
        </div>
      ) : searchQuery ? (
        <div className="p-4 text-center text-gray-500">
          <p>No posts found for "{searchQuery}"</p>
        </div>
      ) : null}
    </div>
  );

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
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                TripTales
              </span>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all"
              title="Search"
            >
              <SearchOutlined style={{ fontSize: "18px" }} />
            </button>

            {/* Mobile Notifications */}
            {userData && <NotificationDropdown isMobile={true} />}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none rounded-full hover:bg-gray-100 transition-all"
              title="Toggle mobile menu"
            >
              <MenuOutlined style={{ fontSize: "18px" }} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-8">
            {/* Search with Results Dropdown */}
            <div className="relative max-w-md w-full mx-4" ref={searchRef}>
              <Input
                placeholder="Search posts..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchValue.trim()) {
                    setShowSearchResults(true);
                  }
                }}
                className="rounded-full py-2 border border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all"
                style={{ paddingLeft: "15px" }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-4 text-blue-500 hover:text-blue-700"
                title="Search"
              >
                <SearchOutlined />
              </button>

              {/* Desktop Search Results Dropdown */}
              {showSearchResults && <SearchResults />}
            </div>

            {/* User Menu */}
            <div className="flex items-center ml-4 space-x-2">
              {/* Desktop Notifications */}
              {userData && <NotificationDropdown />}

              {userData ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center">
                      <ImageComponentAvatar
                        size={40}
                        src={
                          userData.avatar || "https://i.imgur.com/CzXTtJV.jpg"
                        }
                        alt="User Avatar"
                      />
                      <span className="ml-2 font-medium text-gray-700">
                        {userData.username}
                      </span>
                    </div>
                  </button>

                  {dropDown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-xl py-2 z-50 transform origin-top-right transition-all duration-200 ease-out">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Logged in with</p>
                        <p className="font-medium text-gray-800 break-words overflow-hidden">
                          {userData.email || userData.username}
                        </p>
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
                      <Link
                        href="/liked-post"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <span className="flex items-center">
                          <i className="mr-2">❤️</i>
                          Liked Posts
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
                          <span className="flex items-center">Log out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-5 py-2 border rounded-full font-medium transition-all
             border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 
             text-transparent bg-clip-text hover:bg-indigo-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow transition-all font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div
            className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4"
            ref={mobileSearchRef}
          >
            <div className="relative">
              <Input
                placeholder="Search posts..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchValue.trim()) {
                    setShowSearchResults(true);
                  }
                }}
                className="rounded-full py-2"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-4 text-blue-500 hover:text-blue-700"
                title="Search"
              >
                <SearchOutlined />
              </button>

              {/* Mobile Search Results */}
              {showSearchResults && <SearchResults isMobile={true} />}
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-1">
              {userData ? (
                <>
                  <div className="flex items-center px-3 py-2 space-x-3 border-b border-gray-100 mb-2">
                    <ImageComponentAvatar
                      size={32}
                      src={userData.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
                      alt="User Avatar"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {userData.username}
                      </p>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/liked-post"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Liked Posts
                  </Link>
                  {isCreator && (
                    <Link
                      href="/post-list"
                      className="px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Posts
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md w-full"
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
