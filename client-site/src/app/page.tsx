"use client";
import { useState } from "react";
import { ViewOnlyPostList } from "./components/ViewOnlyPostList";
import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreatePostForm from "./components/DraggablePostEditor";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "./store/useAuthStore";

const { Title, Text } = Typography;

export default function Home() {
  const [isFormVisible, setFormVisible] = useState(false);
  const { userData } = useAuthStore();
  const isCreator = userData?.isCreator || false;
  const openForm = () => setFormVisible(true);
  const closeForm = () => setFormVisible(false);

  return (
    <div className="pb-16">
      {/* Added padding bottom to avoid footer overlap */}
      {/* Hero Section */}
      <div
        className="relative overflow-hidden bg-cover bg-center h-64 md:h-96"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1700828284504-02bd8d5fb2d4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundPosition: "left center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-6 flex flex-col items-center justify-center h-full relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
            JOURNEY TO DISCOVER THE WORLD
          </h1>
          <p className="text-xl text-white text-center max-w-2xl drop-shadow-md">
            Share your experiences and connect with fellow travel enthusiasts
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-full mx-auto">
          {/* Posts List - Removed absolute positioning */}
          <div className="w-full">
            <ViewOnlyPostList />
          </div>
        </div>
      </div>
      {/* Create Post Button */}
      {isCreator && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: isFormVisible ? 135 : 0 }}
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            onClick={() => setFormVisible((prev) => !prev)}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 8px rgba(0, 200, 255, 0.8)",
                "0 0 16px rgba(0, 200, 255, 0.9)",
                "0 0 8px rgba(0, 200, 255, 0.8)",
                "0 0 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition duration-300 ease-in-out shadow-xl"
          >
            <PlusOutlined />
          </motion.button>
        </motion.div>
      )}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-4xl max-h-[90vh] overflow-auto"
            >
              <CreatePostForm onClose={closeForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}