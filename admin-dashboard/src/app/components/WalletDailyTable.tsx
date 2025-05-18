import React from "react";
import { Table, Button, Space } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useViews } from "../hooks/useView";

interface WalletDailyType {
  key: string | number;
  author: string;
  postId: string | number;
  title: string;
  viewCount: number;
  paid: number;
}

const WalletDailyTable: React.FC = () => {
  const { useGetViews, useCalculateDailyEarnings } = useViews();
  const { data: viewsResponse, isLoading } = useGetViews();
  const { mutate: calculateEarnings } = useCalculateDailyEarnings();

  const columns: TableColumnsType<WalletDailyType> = [
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Post ID", dataIndex: "postId", key: "postId" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "View Count", dataIndex: "viewCount", key: "viewCount" },
    {
      title: "Amount Due",
      dataIndex: "paid",
      key: "paid",
      render: (value: number) => (
        <Space>
          <DollarOutlined />
          <span>{value}</span>
        </Space>
      ),
    },
  ];

  const data: WalletDailyType[] =
    viewsResponse?.map((item: any) => ({
      key: item.postId,
      author: item.author,
      postId: item.postId,
      title: item.title,
      viewCount: item.viewCount,
      paid: item.Paid,
    })) || [];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<DollarOutlined />}
          onClick={() => calculateEarnings()}
          size="large"
        >
          Calculate Amount Due
        </Button>
      </div>
      <Table<WalletDailyType>
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        rowKey="key"
      />
    </div>
  );
};

export default WalletDailyTable;
