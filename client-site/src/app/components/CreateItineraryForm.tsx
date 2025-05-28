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
  Modal,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  SaveOutlined,
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
  const { useCreateItinerary, useUploadDayImage } = useItinerary();
  const createMutation = useCreateItinerary();
  const uploadImageMutation = useUploadDayImage();

  const [days, setDays] = useState<any[]>([{ dayNumber: 1, activities: [], budgetMin: 0, budgetMax: 0 }]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [createdItineraryId, setCreatedItineraryId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFinish = async (values: any) => {
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

    try {
      const result = await createMutation.mutateAsync(itineraryData);
      
      // Store the created itinerary ID
      if (result?.id) {
        setCreatedItineraryId(result.id);
        
        // Upload images for days if there are any
        if (Object.keys(selectedFiles).length > 0) {
          setIsUploading(true);
          
          // Upload images for each day sequentially
          for (const [dayNumber, file] of Object.entries(selectedFiles)) {
            if (file) {
              try {
                await uploadImageMutation.mutateAsync({
                  itineraryId: result.id,
                  dayNumber: parseInt(dayNumber),
                  file: file
                });
              } catch (error) {
                console.error(`Failed to upload image for day ${dayNumber}:`, error);
                message.error(`Failed to upload image for day ${dayNumber}`);
              }
            }
          }
          
          setIsUploading(false);
        }
        
        message.success("Itinerary created successfully with all images!");
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create itinerary:", error);
      message.error("Failed to create itinerary. Please try again later.");
    }
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
    
    // Clean up any image preview and file for the removed day
    const dayNumber = index + 1;
    if (previewUrls[dayNumber]) {
      URL.revokeObjectURL(previewUrls[dayNumber]);
      
      setPreviewUrls(prev => {
        const newUrls = {...prev};
        delete newUrls[dayNumber];
        return newUrls;
      });
      
      setSelectedFiles(prev => {
        const newFiles = {...prev};
        delete newFiles[dayNumber];
        return newFiles;
      });
    }
    
    setDays(renumberedDays);
  };

  const handleImageUpload = (dayNumber: number, file: File) => {
    // Check file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    
    // Check file size (less than 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    
    // Store the file for later upload after itinerary creation
    setSelectedFiles({
      ...selectedFiles,
      [dayNumber]: file,
    });
    
    // Create and store preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewUrls({
      ...previewUrls,
      [dayNumber]: previewUrl
    });
    
    return false; // Prevent default upload behavior
  };
  
  const removeImage = (dayNumber: number) => {
    // Revoke the object URL to free memory
    if (previewUrls[dayNumber]) {
      URL.revokeObjectURL(previewUrls[dayNumber]);
    }
    
    setPreviewUrls(prev => {
      const newUrls = {...prev};
      delete newUrls[dayNumber];
      return newUrls;
    });
    
    setSelectedFiles(prev => {
      const newFiles = {...prev};
      delete newFiles[dayNumber];
      return newFiles;
    });
  };
  
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const isFormSubmitting = createMutation.isPending || isUploading;

  return (
    
      <><Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      disabled={disabled || isFormSubmitting}
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
              maxLength={500} />
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
            extra={<Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                removeDay(index);
              } } />}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name={`location_${index}`}
                  label={<Space>
                    <EnvironmentOutlined />
                    <span>Location</span>
                  </Space>}
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
                    rows={4} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={`budgetMin_${index}`}
                  label={<Space>
                    <DollarOutlined />
                    <span>Minimum Budget</span>
                  </Space>}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    precision={2}
                    placeholder="0.00" />
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
                    placeholder="0.00" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<Space>
                <PictureOutlined />
                <span>Day Image</span>
              </Space>}
            >
              {previewUrls[day.dayNumber] ? (
                <div style={{ position: 'relative', width: '104px', height: '104px', border: '1px solid #d9d9d9', borderRadius: '2px', overflow: 'hidden' }}>
                  <img
                    src={previewUrls[day.dayNumber]}
                    alt={`Day ${day.dayNumber} Preview`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.65)',
                      padding: '4px',
                      display: 'flex',
                      justifyContent: 'space-around'
                    }}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined style={{ color: 'white' }} />}
                      onClick={() => handlePreview(previewUrls[day.dayNumber])} />
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined style={{ color: 'white' }} />}
                      onClick={() => removeImage(day.dayNumber)} />
                  </div>
                </div>
              ) : (
                <Upload
                  listType="picture-card"
                  beforeUpload={(file) => handleImageUpload(day.dayNumber, file)}
                  showUploadList={false}
                  accept="image/*"
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              )}
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                Upload an image for Day {day.dayNumber} (max 5MB)
              </Text>
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
          loading={isFormSubmitting}
          disabled={!postId || disabled}
          icon={<SaveOutlined />}
        >
          {isFormSubmitting ? "Creating Itinerary..." : "Create Itinerary"}
        </Button>
      </Form.Item>
    </Form><Modal
      visible={previewVisible}
      title="Image Preview"
      footer={null}
      onCancel={() => setPreviewVisible(false)}
    >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal></>
  );
};

export default CreateItineraryForm;
