import React, { useState } from "react";
import { Table, Button, Space, Input, Card } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useReport } from "../hooks/useReport";
import { toast } from "react-hot-toast";

export interface ReportType {
  key: number;
  id: number;
  reason: string;
  postId: number;
  reportedAt: string;
  reportedBy: {
    id: number;
    username: string;
    email: string;
  };
}

const ReportTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [processedReports, setProcessedReports] = useState<number[]>([]);
  const { useGetReport, useDeleteReport } = useReport();
  const { data: reportsResponse, isLoading } = useGetReport();
  // We are reusing the delete mutation to simulate processing the report.
  // You can replace this with a dedicated processReport hook if available.
  const { mutate: processReport } = useDeleteReport();

  const handleProcess = (id: number) => {
    processReport(id, {
      onSuccess: () => {
        setProcessedReports((prev) => [...prev, id]);
        toast.success("Report processed successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Error processing report");
      },
    });
  };

  // Map API response to our ReportType array
  const data: ReportType[] = reportsResponse?.data
    ? reportsResponse.data.map((report: any) => ({
        key: report.id,
        id: report.id,
        reason: report.reason,
        postId: report.postId,
        reportedAt: report.reportedAt,
        reportedBy: report.reportedBy,
      }))
    : [];

  const filterData = (data: ReportType[]): ReportType[] => {
    return data.filter((report) =>
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const columns: TableColumnsType<ReportType> = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Post ID",
      dataIndex: "postId",
      key: "postId",
    },
    {
      title: "Reported At",
      dataIndex: "reportedAt",
      key: "reportedAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Reported By",
      dataIndex: "reportedBy",
      key: "reportedBy",
      render: (reportedBy: ReportType["reportedBy"]) => (
        <span>
          {reportedBy.username} ({reportedBy.email})
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space>
          {processedReports.includes(record.id) ? (
            // Show a green check mark if the report is processed
            <CheckCircleOutlined style={{ color: "green", fontSize: 20 }} />
          ) : (
            // Otherwise, display a button to process the report
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleProcess(record.id)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Report Management" bordered={false}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Input.Search
            placeholder="Search reports by reason..."
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        <Table<ReportType>
          columns={columns}
          dataSource={filterData(data)}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default ReportTable;
