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
    <div className="flex flex-col items-center justify-start min-h-screen py-12 px-10 md:px-32">
      <div className="w-full max-w-7xl p-5 bg-white">
        {/* Tiêu đề */}
        <div className="text-center py-8 border-b mb-8">
          <Title level={2} style={{ marginBottom: 0 }}>
            CHIA SẺ HÀNH TRÌNH DU LỊCH &amp; KẾT NỐI CỘNG ĐỒNG
          </Title>
          <Text type="secondary">
            Đây là không gian để mọi người cùng nhau chia sẻ trải nghiệm du
            lịch, khám phá thế giới và tạo nên những kỷ niệm đáng nhớ.
          </Text>
        </div>

        {/* Danh sách bài viết */}
        <ViewOnlyPostList />
      </div>

      {isCreator && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: isFormVisible ? 45 : 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "60px",
            zIndex: 1001,
          }}
        >
          <Button
            icon={<PlusOutlined style={{ fontSize: "32px" }} />}
            shape="circle"
            size="large"
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#1890ff",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setFormVisible((prev) => !prev)}
          />
        </motion.div>
      )}

      {/* Overlay form */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                maxWidth: "90vw",
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              <CreatePostForm onClose={closeForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}