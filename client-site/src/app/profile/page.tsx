"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Modal,
  Form,
  Input,
  Button,
  Card,
  Descriptions,
  Divider,
  DatePicker,
  Upload,
  message,
  Spin,
  Typography,
  Badge,
  Tooltip,
  Row,
  Col,
  Statistic,
  Progress,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  InfoCircleOutlined,
  CameraOutlined,
  WalletOutlined,
  DollarOutlined,
  ProfileOutlined,
  FileTextOutlined,
  BankOutlined,
  SendOutlined,
} from "@ant-design/icons";
import useAuthStore from "../store/useAuthStore";
import { useProfile } from "../hooks/useProfile";
import type { RcFile } from "antd/es/upload/interface";
import ImageComponentAvatar from "../components/ImageComponentAvatar";
import { useWallet } from "../hooks/useWallet";
import { toast } from "react-hot-toast";
import Link from "next/link";
import dayjs from "dayjs"; // Import dayjs for better date handling

const { Title, Paragraph, Text } = Typography;

const Profile = () => {
  const { userData } = useAuthStore();
  const { updateProfileMutation, updateAvatarMutation } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { useCreateWallet, useGetWalletByUserId, useRequestWithdrawal } =
    useWallet(userData?.id || "");
  const requestWithdrawalMutation = useRequestWithdrawal();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const { data: walletData, isPending: isWalletPending } =
    useGetWalletByUserId();
  const createWalletMutation = useCreateWallet();
  const [form] = Form.useForm();
  const isCreator = userData?.isCreator || false;

  // Set form values when userData changes or modal opens
  useEffect(() => {
    if (userData && isModalOpen) {
      form.setFieldsValue({
        username: userData.username,
        bio: userData.bio,
        birthday: userData.birthday ? dayjs(userData.birthday) : undefined,
      });
    }
  }, [userData, form, isModalOpen]);

  // Loading state
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <Card className="shadow-lg rounded-xl p-8 border-none">
          <Title level={4} className="text-center mb-4">Information Not Found</Title>
          <Paragraph className="text-center text-gray-500">
            Invalid user data, please log in
          </Paragraph>
          <Button type="primary" size="large" block>
            Log In
          </Button>
        </Card>
      </div>
    );
  }

  const handleEditProfile = () => {
    // Reset form with current userData before opening modal
    form.setFieldsValue({
      username: userData.username,
      bio: userData.bio,
      birthday: userData.birthday ? dayjs(userData.birthday) : undefined,
    });
    setIsModalOpen(true);
  };

  const handleSaveChanges = (values: any) => {
    // Format birthday properly before submitting
    const formattedValues = {
      ...values,
      birthday: values.birthday 
        ? values.birthday.format('YYYY-MM-DD') // Format as ISO date string
        : undefined,
    };

    updateProfileMutation.mutate(formattedValues, {
      onSuccess: () => {
        setIsModalOpen(false);
        form.resetFields();
        toast.success("Profile updated successfully!");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update profile");
      }
    });
  };

  const handleAvatarChange = async (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Only image files are allowed!");
      return false;
    }

    try {
      await updateAvatarMutation.mutateAsync(file);
      toast.success("Avatar updated successfully!");
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleCreateWallet = async () => {
    try {
      await createWalletMutation.mutateAsync();
      toast.success("Wallet created successfully!");
    } catch (error) {
      toast.error("Unable to create wallet, please try again later.");
    }
  };

  const handleRequestWithdrawal = async () => {
    try {
      await requestWithdrawalMutation.mutateAsync({ amount: withdrawAmount });
      toast.success("Withdrawal request submitted!");
      setWithdrawAmount(0);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Withdrawal error, please try again later",
      );
    }
  };

  // Format birthday for display
  const formattedBirthday = userData.birthday
    ? dayjs(userData.birthday).format("DD-MM-YYYY")
    : "Not updated";

  // Calculate percentage for wallet balance visual
  const maxBalance = walletData?.balance ? Math.max(walletData.balance * 1.5, 100) : 100;
  const percentage = walletData?.balance ? (walletData.balance / maxBalance) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card 
          className="shadow-2xl rounded-3xl overflow-hidden border-none"
          bodyStyle={{ padding: 0 }}
        >
          {/* Header section with gradient background */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 pt-16 pb-24 px-8 relative">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>
          
          {/* Profile content */}
          <div className="px-8 pb-8 pt-0 relative">
            {/* Avatar section - positioned to overlap the header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8 relative z-10">
              <div className="relative group">
                <div className="rounded-full p-1 bg-white shadow-lg">
                  <ImageComponentAvatar
                    size={140}
                    src={userData.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
                    alt="User Avatar"
                  />
                </div>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleAvatarChange}
                  className="absolute bottom-2 right-2"
                >
                  <Tooltip title="Change Avatar">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CameraOutlined />}
                      size="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    />
                  </Tooltip>
                </Upload>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-300" />
              </div>
              
              <div className="text-center sm:text-left">
                <Badge 
                  dot={isCreator} 
                  color="blue" 
                  offset={[-2, 2]}
                >
                  <Title level={2} className="mb-1 text-gray-800 flex items-center gap-2">
                    {userData.username}
                    {isCreator && (
                      <Tooltip title="Creator">
                        <span className="text-blue-500 text-sm bg-blue-50 px-2 py-1 rounded-md">Creator</span>
                      </Tooltip>
                    )}
                  </Title>
                </Badge>
                <Paragraph className="text-gray-500 mb-0">
                  {userData.email}
                </Paragraph>
              </div>

              <div className="ml-auto mt-4 sm:mt-0">
                <Button
                  type="primary"
                  size="large"
                  icon={<EditOutlined />}
                  onClick={handleEditProfile}
                  className="px-6 h-10 flex items-center shadow-md"
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            <Divider className="my-6" />

            {/* Main content section */}
            <Row gutter={[24, 24]}>
              {/* Left column - User details */}
              <Col xs={24} md={16}>
                <Card 
                  title={
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-blue-500" />
                      <span>Personal Information</span>
                    </div>
                  }
                  className="shadow-md rounded-xl h-full"
                  bordered={false}
                >
                  <div className="space-y-6">
                    <div>
                      <Text type="secondary" className="block mb-1">
                        <UserOutlined className="mr-2 text-blue-500" />
                        Username
                      </Text>
                      <Text strong className="text-lg">{userData.username}</Text>
                    </div>
                    
                    <div>
                      <Text type="secondary" className="block mb-1">
                        <MailOutlined className="mr-2 text-blue-500" />
                        Email
                      </Text>
                      <Text strong className="text-lg">{userData.email}</Text>
                    </div>
                    
                    <div>
                      <Text type="secondary" className="block mb-1">
                        <CalendarOutlined className="mr-2 text-blue-500" />
                        Birthday
                      </Text>
                      <Text strong className="text-lg">
                        {formattedBirthday}
                      </Text>
                    </div>
                    
                    <div>
                      <Text type="secondary" className="block mb-1">
                        <InfoCircleOutlined className="mr-2 text-blue-500" />
                        Bio
                      </Text>
                      <Paragraph className="text-lg bg-gray-50 p-4 rounded-lg">
                        {userData.bio || "No bio available"}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Right column - Wallet & Actions */}
              <Col xs={24} md={8}>
                <Row gutter={[0, 24]}>
                  {/* Wallet section */}
                  <Col xs={24}>
                    <Card 
                      title={
                        <div className="flex items-center gap-2">
                          <WalletOutlined className="text-blue-500" />
                          <span>My Wallet</span>
                        </div>
                      }
                      className="shadow-md rounded-xl"
                      bordered={false}
                    >
                      {isWalletPending ? (
                        <div className="flex justify-center py-8">
                          <Spin size="large" />
                        </div>
                      ) : walletData?.balance !== undefined ? (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
                            <div className="flex justify-between items-center">
                              <div>
                                <Text className="text-white opacity-80">Current Balance</Text>
                                <Title level={2} className="text-white mb-0">
                                  ${walletData.balance.toFixed(2)}
                                </Title>
                              </div>
                              <BankOutlined className="text-4xl opacity-80" />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Text strong className="block mb-2">Withdraw Funds</Text>
                            <div className="space-y-3">
                              <Input
                                type="number"
                                min={0}
                                max={walletData.balance}
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                prefix={<DollarOutlined className="text-gray-400" />}
                                addonAfter="USD"
                                size="large"
                              />
                              <Progress 
                                percent={(withdrawAmount / walletData.balance) * 100} 
                                showInfo={false}
                                strokeColor={{
                                  '0%': '#108ee9',
                                  '100%': '#87d068',
                                }}
                              />
                              <Button
                                type="primary"
                                block
                                onClick={handleRequestWithdrawal}
                                loading={requestWithdrawalMutation.isPending}
                                disabled={withdrawAmount <= 0 || withdrawAmount > walletData.balance}
                                icon={<SendOutlined />}
                                size="large"
                                className="mt-2"
                              >
                                Withdraw
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : isCreator ? (
                        <div className="text-center py-6">
                          <InfoCircleOutlined className="text-4xl text-gray-300 mb-4" />
                          <Paragraph className="mb-4">You don't have a wallet yet</Paragraph>
                          <Button
                            type="primary"
                            size="large"
                            onClick={handleCreateWallet}
                            loading={createWalletMutation.isPending}
                            icon={<WalletOutlined />}
                            block
                          >
                            Create Wallet Now
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <InfoCircleOutlined className="text-4xl text-gray-300 mb-4" />
                          <Paragraph>You do not have wallet access</Paragraph>
                        </div>
                      )}
                    </Card>
                  </Col>

                  {/* Manage Posts section (for creators) */}
                  {isCreator && (
                    <Col xs={24}>
                      <Card 
                        className="shadow-md rounded-xl" 
                        bordered={false}
                        title={
                          <div className="flex items-center gap-2">
                            <FileTextOutlined className="text-blue-500" />
                            <span>Manage Posts</span>
                          </div>
                        }
                      >
                        <Link href="/post-list">
                          <Button
                            type="default"
                            size="large"
                            icon={<ProfileOutlined />}
                            block
                            className="hover:bg-blue-50 transition-colors"
                          >
                            View My Posts
                          </Button>
                        </Link>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <EditOutlined className="text-blue-500" />
            <span>Update Personal Information</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={560}
        centered
        className="rounded-xl overflow-hidden"
        destroyOnClose={true} // Important to prevent form state issues
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveChanges}
          className="pt-4"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input 
              size="large" 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Enter your username" 
            />
          </Form.Item>
          
          <Form.Item 
            label="Bio" 
            name="bio"
            extra="Write a few lines to introduce yourself"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Write a few lines about yourself..." 
              className="text-base"
            />
          </Form.Item>
          
          <Form.Item 
            label="Birthday" 
            name="birthday"
          >
            <DatePicker
              format="DD-MM-YYYY"
              className="w-full"
              placeholder="Select your birthday"
              size="large"
              showToday={false}
              disabledDate={current => current && current > dayjs().endOf('day')}
            />
          </Form.Item>
          
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={() => setIsModalOpen(false)} 
              size="large" 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={updateProfileMutation.isPending}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;