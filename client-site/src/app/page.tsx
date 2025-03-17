"use client";
import { ViewOnlyPostList } from "./components/ViewOnlyPostList";
import { Typography } from "antd";

const { Title, Text } = Typography;

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 px-10 md:px-32">
      <div className="w-full max-w-7xl p-5 bg-white">

        {/* Hero / Banner giới thiệu (đẩy từ ViewOnlyPostList sang đây) */}
        <div className="text-center py-8 border-b mb-8">
          <Title level={2} style={{ marginBottom: 0 }}>
            CHIA SẺ HÀNH TRÌNH DU LỊCH &amp; KẾT NỐI CỘNG ĐỒNG
          </Title>
          <Text type="secondary">
            Đây là không gian để mọi người cùng nhau chia sẻ trải nghiệm du lịch, khám phá thế giới
            và tạo nên những kỷ niệm đáng nhớ.
          </Text>
        </div>

        {/* Gọi ViewOnlyPostList */}
        <ViewOnlyPostList />
      </div>
    </div>
  );
}
