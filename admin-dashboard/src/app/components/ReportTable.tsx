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
  const { mutate: processReport } = useDeleteReport();

  const handleProcess = (id: number) => {
    processReport(id, {
      onSuccess: () => {
        setProcessedReports((prev) => [...prev, id]);
        toast.success("Báo cáo đã được xử lý thành công");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Lỗi xử lý báo cáo");
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
      title: "ID báo cáo",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "ID bài viết",
      dataIndex: "postId",
      key: "postId",
    },
    {
      title: "Ngày báo cáo",
      dataIndex: "reportedAt",
      key: "reportedAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Người báo cáo",
      dataIndex: "reportedBy",
      key: "reportedBy",
      render: (reportedBy: ReportType["reportedBy"]) => (
        <span>
          {reportedBy.username} ({reportedBy.email})
        </span>
      ),
    },
    {
      title: "Hành động",
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
      <Card bordered={false}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm báo cáo theo lý do ..."
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
