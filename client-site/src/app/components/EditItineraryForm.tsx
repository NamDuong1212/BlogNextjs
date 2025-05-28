"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Typography,
  Divider,
  Card,
  InputNumber,
  Upload,
  Modal,
  Empty,
  Spin,
  Alert,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CalendarOutlined,
  PictureOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useItinerary } from "../hooks/useItinerary";
import { Post } from "../types/post";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Define interfaces
interface Itinerary {
  id?: string;
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  totalDays: number;
  currency: string;
  estimatedTotalBudgetMin: number;
  estimatedTotalBudgetMax: number;
  postId: string;
  days: ItineraryDay[];
}

interface ItineraryDay {
  id?: string;
  dayNumber: number;
  location: string;
  activities: string;
  budgetMin: number;
  budgetMax: number;
  image?: string;
}

interface EditItineraryFormProps {
  post: Post;
  onSave?: () => void;
}

const EditItineraryForm: React.FC<EditItineraryFormProps> = ({ post, onSave }) => {
  const [form] = Form.useForm();
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [existingItinerary, setExistingItinerary] = useState<Itinerary | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [totalDays, setTotalDays] = useState(0);
  // New state for temporary image storage (similar to CreateItineraryForm)
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  const [isUploading, setIsUploading] = useState(false);

  // Get hooks from useItinerary
  const {
    useGetItineraryByPostId,
    useCreateItinerary,
    useUpdateItinerary,
    useDeleteItinerary,
    useUploadDayImage,
    useDeleteItineraryDay,
  } = useItinerary();

  // Fetch existing itinerary if any
  const {
    data: itineraryData,
    isLoading,
    error,
  } = useGetItineraryByPostId(post.id);

  // Mutation hooks
  const createMutation = useCreateItinerary(onSave);
  const updateMutation = useUpdateItinerary(onSave);
  const deleteMutation = useDeleteItinerary(onSave);
  const uploadImageMutation = useUploadDayImage();
  const deleteDayMutation = useDeleteItineraryDay();

  // Set form data and days when itinerary data is loaded
  useEffect(() => {
    if (!isLoading) {
      if (itineraryData) {
        setExistingItinerary(itineraryData);
        
        // Format the dates for the form
        const startDate = dayjs(itineraryData.startDate);
        const endDate = dayjs(itineraryData.endDate);
        setDates([startDate, endDate]);
        setTotalDays(itineraryData.totalDays);
        
        // Set form values
        form.setFieldsValue({
          title: itineraryData.title,
          description: itineraryData.description,
          dateRange: [startDate, endDate],
          currency: itineraryData.currency,
        });
        
        // Set days
        if (itineraryData.days && itineraryData.days.length > 0) {
          setDays(itineraryData.days);
        }
      } else {
        // Initialize with empty form for new itinerary
        setDays([]);
        form.resetFields();
      }
      setLoading(false);
    }
  }, [itineraryData, isLoading, form]);

  // Handle date range change
  const onDateRangeChange = (values: any) => {
    if (values && values[0] && values[1]) {
      const startDate = values[0];
      const endDate = values[1];
      const daysDiff = endDate.diff(startDate, 'day') + 1;
      setDates([startDate, endDate]);
      setTotalDays(daysDiff);
      
      // Update the dayNumber for each day if necessary
      const updatedDays = [...days];
      updatedDays.forEach(day => {
        if (day.dayNumber > daysDiff) {
          day.dayNumber = daysDiff;
        }
      });
      setDays(updatedDays);
    } else {
      setDates([null, null]);
      setTotalDays(0);
    }
  };

  // Add a new day
  const addDay = () => {
    if (totalDays === 0) {
      toast.error("Please select a date range first");
      return;
    }
    
    const newDay: ItineraryDay = {
      dayNumber: 1,
      location: "",
      activities: "",
      budgetMin: 0,
      budgetMax: 0,
    };
    
    setDays([...days, newDay]);
  };

  // Remove a day
  const removeDay = async (index: number) => {
    const dayToRemove = days[index];
    
    if (dayToRemove.id && existingItinerary?.id) {
      try {
        await deleteDayMutation.mutateAsync({
          itineraryId: existingItinerary.id,
          dayId: dayToRemove.id
        });
      } catch (error) {
        console.error("Failed to delete day:", error);
        return;
      }
    }
    
    const updatedDays = [...days];
    updatedDays.splice(index, 1);
    setDays(updatedDays);
    
    // Clean up any previews for this day
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(prev => {
        const newUrls = {...prev};
        delete newUrls[index];
        return newUrls;
      });
      
      setSelectedFiles(prev => {
        const newFiles = {...prev};
        delete newFiles[index];
        return newFiles;
      });
    }
  };

  // Update day fields
  const updateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const updatedDays = [...days];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setDays(updatedDays);
  };

  // Handle image upload for a day - updated to work like CreateItineraryForm
  const handleImageUpload = async (file: File, index: number) => {
    // Check file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('You can only upload image files!');
      return false;
    }
    
    // Check file size (less than 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error('Image must be smaller than 5MB!');
      return false;
    }
    
    if (existingItinerary?.id && days[index].id) {
      // If itinerary exists, upload directly to the server
      try {
        setIsUploading(true);
        await uploadImageMutation.mutateAsync({
          itineraryId: existingItinerary.id,
          dayNumber: days[index].dayNumber,
          file: file
        });
        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload image");
        return false;
      }
    } else {
      // If itinerary doesn't exist yet, store the file locally
      setSelectedFiles({
        ...selectedFiles,
        [index]: file,
      });
      
      // Create and store preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls({
        ...previewUrls,
        [index]: previewUrl
      });
    }
    
    return false; // Prevent default upload behavior
  };

  // Handle image preview
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };
  
  // New function to remove image
  const removeImage = async (index: number) => {
    const dayToUpdate = days[index];
    
    if (dayToUpdate.id && existingItinerary?.id && dayToUpdate.image) {
      // If it's a saved image, we need to make an API call to remove it
      try {
        setIsUploading(true);
        
        // This would need to be implemented in your API
        // Here we're simulating the update by modifying the day object
        const updatedDay = { ...dayToUpdate, image: null };
        await updateMutation.mutateAsync({
          id: existingItinerary.id,
          data: {
            ...existingItinerary,
            days: days.map((day, i) => i === index ? updatedDay : day)
          }
        });
        
        // Update local state
        const updatedDays = [...days];
        updatedDays[index] = { ...updatedDays[index], image: undefined };
        setDays(updatedDays);
        
        setIsUploading(false);
        toast.success("Image removed successfully");
      } catch (error) {
        setIsUploading(false);
        console.error("Failed to remove image:", error);
        toast.error("Failed to remove image");
      }
    } else if (previewUrls[index]) {
      // If it's a local preview, just remove it
      URL.revokeObjectURL(previewUrls[index]);
      
      setPreviewUrls(prev => {
        const newUrls = {...prev};
        delete newUrls[index];
        return newUrls;
      });
      
      setSelectedFiles(prev => {
        const newFiles = {...prev};
        delete newFiles[index];
        return newFiles;
      });
    }
  };

  const handleDeleteItinerary = async () => {
    if (!existingItinerary?.id) return;
    
    try {
      await deleteMutation.mutateAsync(existingItinerary.id);
      setExistingItinerary(null);
      setDays([]);
      form.resetFields();
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
    }
  };

  // Submit form
  const onFinish = async (values: any) => {
    if (!dates[0] || !dates[1]) {
      toast.error("Please select a date range");
      return;
    }
    
    if (days.length === 0) {
      toast.error("Please add at least one day to your itinerary");
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      const itineraryData = {
        title: values.title,
        description: values.description || "",
        startDate: dates[0]?.format("YYYY-MM-DD"),
        endDate: dates[1]?.format("YYYY-MM-DD"),
        currency: values.currency || "USD",
        postId: post.id!,
        days: days.map(day => ({
          ...day,
          budgetMin: day.budgetMin || 0,
          budgetMax: day.budgetMax || 0
        }))
      };
      
      let itineraryId;
      
      if (existingItinerary?.id) {
        // Update existing itinerary
        const result = await updateMutation.mutateAsync({
          id: existingItinerary.id,
          data: itineraryData
        });
        itineraryId = existingItinerary.id;
      } else {
        // Create new itinerary
        const result = await createMutation.mutateAsync(itineraryData);
        itineraryId = result?.id;
      }
      
      // Upload any pending images
      if (itineraryId && Object.keys(selectedFiles).length > 0) {
        setIsUploading(true);
        
        // Upload images for each day sequentially
        for (const [index, file] of Object.entries(selectedFiles)) {
          if (file) {
            try {
              const dayIndex = parseInt(index);
              await uploadImageMutation.mutateAsync({
                itineraryId,
                dayNumber: days[dayIndex].dayNumber,
                file: file
              });
            } catch (error) {
              console.error(`Failed to upload image for day ${index}:`, error);
              toast.error(`Failed to upload image for day ${index}`);
            }
          }
        }
        
        // Clear temporary files
        setSelectedFiles({});
        
        // Clear preview URLs
        Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls({});
        
        setIsUploading(false);
      }
      
      onSave?.();
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return <Spin size="large" tip="Loading itinerary data..." />;
  }

  if (error) {
    return <Alert type="error" message="Failed to load itinerary data" description={(error as Error).message} />;
  }

  return (
    <div className="w-full">
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0 }}>
          <CalendarOutlined /> {existingItinerary ? "Edit Itinerary" : "Add Itinerary"}
        </Title>
        <Text type="secondary">
          {existingItinerary
            ? "Update your travel plan details"
            : "Add a travel plan to your post"}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={formSubmitting || isUploading}
      >
        
          <Form.Item
            name="title"
            label="Itinerary Title"
            rules={[
              { required: true, message: "Please enter an itinerary title" },
              { min: 5, message: "Title must be at least 5 characters" },
              { max: 100, message: "Title cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="e.g., 7 Days in Japan" maxLength={100} showCount />
          </Form.Item>

          <Form.Item
            name="description"
            label="Itinerary Description"
          >
            <TextArea
              rows={3}
              placeholder="Brief description of your travel plan"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="dateRange"
              label="Travel Dates"
              style={{ flex: 2 }}
              rules={[{ required: true, message: "Please select your travel dates" }]}
            >
              <RangePicker
                style={{ width: "100%" }}
                onChange={onDateRangeChange}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              name="currency"
              label="Currency"
              style={{ flex: 1 }}
              initialValue="USD"
            >
              <Select>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
                <Select.Option value="JPY">JPY</Select.Option>
                <Select.Option value="VND">VND</Select.Option>
                <Select.Option value="AUD">AUD</Select.Option>
                <Select.Option value="CAD">CAD</Select.Option>
                <Select.Option value="SGD">SGD</Select.Option>
              </Select>
            </Form.Item>
          </div>
        

        <Divider orientation="left">
          Itinerary Days ({days.length}/{totalDays || "?"})
        </Divider>

        {totalDays > 0 ? (
          <div style={{ marginBottom: "16px" }}>
            <Alert
              message={`Your trip is ${totalDays} day${totalDays > 1 ? "s" : ""} long`}
              type="info"
              showIcon
            />
          </div>
        ) : (
          <div style={{ marginBottom: "16px" }}>
            <Alert
              message="Please select a date range to start planning your daily itinerary"
              type="warning"
              showIcon
            />
          </div>
        )}

        {days.length > 0 ? (
          days.map((day, index) => (
            <Card
              key={index}
              title={`Day ${day.dayNumber}`}
              style={{ marginBottom: "16px" }}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeDay(index)}
                >
                  Remove
                </Button>
              }
            >
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <Form.Item label="Day Number">
                    <Select
                      value={day.dayNumber}
                      onChange={(value) => updateDay(index, "dayNumber", value)}
                    >
                      {Array.from({ length: totalDays }, (_, i) => (
                        <Select.Option key={i + 1} value={i + 1}>
                          Day {i + 1}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="Location">
                    <Input
                      placeholder="e.g., Tokyo, Japan"
                      value={day.location}
                      onChange={(e) => updateDay(index, "location", e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="Budget Range">
                    <Space>
                      <InputNumber
                        min={0}
                        placeholder="Min"
                        value={day.budgetMin}
                        onChange={(value) => updateDay(index, "budgetMin", value || 0)}
                        style={{ width: "150px" }}
                      />
                      <span>to</span>
                      <InputNumber
                        min={0}
                        placeholder="Max"
                        value={day.budgetMax}
                        onChange={(value) => updateDay(index, "budgetMax", value || 0)}
                        style={{ width: "150px" }}
                      />
                    </Space>
                  </Form.Item>
                </div>

                <div style={{ flex: 1 }}>
                  <Form.Item label="Activities">
                    <TextArea
                      rows={5}
                      placeholder="Describe your activities for this day"
                      value={day.activities}
                      onChange={(e) => updateDay(index, "activities", e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="Day Image">
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {day.image ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={day.image}
                            alt={`Day ${day.dayNumber}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "rgba(0,0,0,0.65)",
                              padding: "4px",
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<EyeOutlined style={{ color: "white" }} />}
                              onClick={() => handlePreview(day.image!)}
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined style={{ color: "white" }} />}
                              onClick={() => removeImage(index)}
                            />
                          </div>
                        </div>
                      ) : previewUrls[index] ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={previewUrls[index]}
                            alt={`Day ${day.dayNumber} Preview`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "rgba(0,0,0,0.65)",
                              padding: "4px",
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<EyeOutlined style={{ color: "white" }} />}
                              onClick={() => handlePreview(previewUrls[index])}
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined style={{ color: "white" }} />}
                              onClick={() => removeImage(index)}
                            />
                          </div>
                        </div>
                      ) : (
                        <Upload
                          name="image"
                          listType="picture-card"
                          showUploadList={false}
                          beforeUpload={(file) => handleImageUpload(file, index)}
                          accept="image/*"
                        >
                          <div>
                            <PictureOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload>
                      )}
                      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                        {existingItinerary?.id ? "Upload or change image" : "Upload image (will be saved when you create the itinerary)"}
                      </Text>
                    </div>
                  </Form.Item>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Empty
            description={
              totalDays === 0
                ? "Select date range first"
                : "No days added yet"
            }
          />
        )}

        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <Button
            type="dashed"
            onClick={addDay}
            block
            icon={<PlusOutlined />}
            disabled={totalDays === 0}
          >
            Add Day
          </Button>
        </div>

        <Divider />

        <Form.Item>
          <Space style={{ float: "right" }}>
            {existingItinerary && (
              <Button
                danger
                onClick={handleDeleteItinerary}
                icon={<DeleteOutlined />}
                disabled={formSubmitting || isUploading}
              >
                Delete Itinerary
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={formSubmitting || isUploading}
              size="large"
            >
              {existingItinerary ? "Update Itinerary" : "Create Itinerary"}
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default EditItineraryForm;