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
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Post ID", dataIndex: "postId", key: "postId" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Views", dataIndex: "viewCount", key: "viewCount" },
    { 
      title: "Paid Amount", 
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
          Calculate All Earnings
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
