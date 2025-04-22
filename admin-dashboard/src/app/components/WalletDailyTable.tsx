import React from "react";
import { Table, Button, Space, Typography } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useViews } from "../hooks/useView";


const WalletDailyTable: React.FC = () => {
  const { useGetViews, useCalculateDailyEarnings } = useViews();
  const { data: viewsResponse, isLoading } = useGetViews();
  const { mutate: calculateEarnings } = useCalculateDailyEarnings();

  const columns: TableColumnsType = [
    { title: "Tác giả", dataIndex: "author", key: "author" },
    { title: "ID bài viết", dataIndex: "postId", key: "postId" },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Lượt xem", dataIndex: "viewCount", key: "viewCount" },
    { 
      title: "Số tiền cần trả", 
      dataIndex: "Paid", 
      key: "Paid",
      render: (value) => (
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <span>{value}</span>
        </Space>
      )
    }
  ];

  const data =
    viewsResponse?.map((item: any) => ({
      key: item.postId,
      author: item.author,
      postId: item.postId,
      title: item.title,
      viewCount: item.viewCount,
      Paid: item.Paid,
    })) || [];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          type="primary"
          icon={<DollarOutlined />}
          onClick={() => calculateEarnings()}
          size="large"
        >
          Tính toán số tiền cần trả
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
      />
    </div>
  );
};

export default WalletDailyTable;
