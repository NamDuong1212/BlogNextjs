"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Space,
  Typography,
  Divider,
  InputNumber,
  Select,
  Row,
  Col,
  Collapse,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  PictureOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useItinerary } from "@/app/hooks/useItinerary";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface CreateItineraryFormProps {
  postId: string | null;
  onSuccess?: () => void;
  disabled?: boolean;
}

const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "VND", label: "VND - Vietnamese Dong" },
  // Add more currencies as needed
];

export const CreateItineraryForm: React.FC<CreateItineraryFormProps> = ({
  postId,
  onSuccess,
  disabled = false,
}) => {
  const [form] = Form.useForm();
  const { useCreateItinerary } = useItinerary();
  const createMutation = useCreateItinerary(onSuccess);

  const [days, setDays] = useState<any[]>([{ dayNumber: 1, activities: [], budgetMin: 0, budgetMax: 0 }]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});

  const handleFinish = (values: any) => {
    if (!postId) {
      message.error("Post ID is required to create an itinerary");
      return;
    }

    const formattedDays = days.map((day, index) => ({
      dayNumber: index + 1,
      activities: values[`activities_${index}`] || "",
      location: values[`location_${index}`] || "",
      budgetMin: values[`budgetMin_${index}`] || 0,
      budgetMax: values[`budgetMax_${index}`] || 0,
    }));

    const itineraryData = {
      postId,
      title: values.title,
      description: values.description,
      startDate: values.dateRange[0].format("YYYY-MM-DD"),
      endDate: values.dateRange[1].format("YYYY-MM-DD"),
      currency: values.currency,
      days: formattedDays,
    };

    createMutation.mutate(itineraryData);
  };

  const addDay = () => {
    const newDay = {
      dayNumber: days.length + 1,
      activities: [],
      budgetMin: 0,
      budgetMax: 0,
    };
    setDays([...days, newDay]);
  };

  const removeDay = (index: number) => {
    if (days.length <= 1) {
      message.info("You must have at least one day in your itinerary");
      return;
    }
    
    const newDays = [...days];
    newDays.splice(index, 1);
    
    // Renumber the days
    const renumberedDays = newDays.map((day, idx) => ({
      ...day,
      dayNumber: idx + 1,
    }));
    
    setDays(renumberedDays);
  };

  const handleImageUpload = (dayNumber: number, file: File) => {
    // Store the file for later upload after itinerary creation
    setSelectedFiles({
      ...selectedFiles,
      [dayNumber]: file,
    });
    return false; // Prevent default upload behavior
  };

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined />
          <span>Create Itinerary</span>
        </Space>
      }
      style={{ marginTop: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        disabled={disabled || createMutation.isPending}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Itinerary Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="e.g., 7-Day Adventure in Vietnam" maxLength={100} showCount />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please provide a description" }]}
            >
              <TextArea
                placeholder="Write a brief overview of this itinerary"
                rows={3}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="dateRange"
              label="Travel Dates"
              rules={[{ required: true, message: "Please select travel dates" }]}
            >
              <DatePicker.RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: "Please select a currency" }]}
              initialValue="USD"
            >
              <Select placeholder="Select currency">
                {currencyOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Itinerary Days</Divider>

        <Collapse defaultActiveKey={['0']} accordion>
          {days.map((day, index) => (
            <Panel
              header={`Day ${day.dayNumber}`}
              key={index.toString()}
              extra={
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDay(index);
                  }}
                />
              }
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name={`location_${index}`}
                    label={
                      <Space>
                        <EnvironmentOutlined />
                        <span>Location</span>
                      </Space>
                    }
                  >
                    <Input placeholder="e.g., Hanoi Old Quarter" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name={`activities_${index}`}
                    label="Activities & Notes"
                    rules={[{ required: true, message: "Please describe the day's activities" }]}
                  >
                    <TextArea
                      placeholder="Describe what to do on this day..."
                      rows={4}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={`budgetMin_${index}`}
                    label={
                      <Space>
                        <DollarOutlined />
                        <span>Minimum Budget</span>
                      </Space>
                    }
                    initialValue={0}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      precision={2}
                      placeholder="0.00"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={`budgetMax_${index}`}
                    label="Maximum Budget"
                    initialValue={0}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      precision={2}
                      placeholder="0.00"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <Space>
                    <PictureOutlined />
                    <span>Day Image</span>
                  </Space>
                }
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={(file) => handleImageUpload(day.dayNumber, file)}
                  showUploadList={!!selectedFiles[day.dayNumber]}
                  maxCount={1}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                <Text type="secondary">You can upload day images after creating the itinerary</Text>
              </Form.Item>
            </Panel>
          ))}
        </Collapse>

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Button type="dashed" onClick={addDay} block icon={<PlusOutlined />}>
            Add Day
          </Button>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending}
            disabled={!postId || disabled}
          >
            Create Itinerary
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateItineraryForm;