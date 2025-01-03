"use client";

import React, { useState } from "react";
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
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  InfoCircleOutlined,
  CameraOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import useAuthStore from "../store/useAuthStore";
import { useProfile } from "../hooks/useProfile";
import type { RcFile } from "antd/es/upload/interface";
import ImageComponentAvatar from "../components/ImageComponentAvatar";
import { useWallet } from "../hooks/useWallet";
const Profile = () => {
  const { userData } = useAuthStore();
  const { updateProfileMutation, updateAvatarMutation } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { useCreateWallet, useGetWalletByUserId } = useWallet(
    userData?.id || "",
  );
  const { data: walletData, isPending: isWalletPending } =
    useGetWalletByUserId();
  const createWalletMutation = useCreateWallet();
  const [form] = Form.useForm();

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">User data not available. Please log in.</p>
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveChanges = (values: any) => {
    const formattedValues = {
      ...values,
      birthday: values.birthday
        ? moment(values.birthday).toISOString()
        : undefined,
    };

    updateProfileMutation.mutate(formattedValues, {
      onSuccess: () => {
        setIsModalOpen(false);
        form.resetFields();
      },
    });
  };

  const handleAvatarChange = async (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    try {
      await updateAvatarMutation.mutateAsync(file);
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleCreateWallet = async () => {
    try {
      await createWalletMutation.mutateAsync({
        userId: userData.id,
      });
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card
          className="shadow-xl rounded-2xl overflow-hidden"
          bordered={false}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <ImageComponentAvatar
                size={120}
                src={userData.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
                alt="User Avatar"
              />
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleAvatarChange}
                className="absolute bottom-0 right-0"
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  size="small"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Upload>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200" />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800">
              {userData.username}
            </h1>
          </div>

          <Divider className="my-6" />

          <Descriptions
            layout="vertical"
            className="bg-white p-6 rounded-xl"
            column={{ xs: 1, sm: 2, md: 2 }}
          >
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <UserOutlined className="text-blue-500" />
                  <span className="font-medium">Username</span>
                </span>
              }
            >
              {userData.username}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <MailOutlined className="text-blue-500" />
                  <span className="font-medium">Email</span>
                </span>
              }
            >
              {userData.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <CalendarOutlined className="text-blue-500" />
                  <span className="font-medium">Birthday</span>
                </span>
              }
            >
              {userData.birthday
                ? moment(userData.birthday).format("YYYY-MM-DD")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <InfoCircleOutlined className="text-blue-500" />
                  <span className="font-medium">Bio</span>
                </span>
              }
              span={2}
            >
              <div className="prose max-w-none">
                {userData.bio || "Nothing here"}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <WalletOutlined className="text-blue-500" />
                  <span className="font-medium">Wallet</span>
                </span>
              }
              span={2}
            >
              {isWalletPending ? (
                <Spin />
              ) : walletData?.balance !== undefined ? (
                <span>Balance: {walletData.balance}</span>
              ) : userData.isCreator ? (
                <Button
                  color="primary"
                  variant="outlined"
                  className="w-50"
                  onClick={handleCreateWallet}
                  loading={createWalletMutation.isPending}
                  icon={<WalletOutlined />}
                >
                  Create Wallet
                </Button>
              ) : (
                <span>You do not have access to Wallet</span>
              )}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-8 flex justify-center">
            <Button
              type="primary"
              size="large"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              className="px-8 h-12 flex items-center"
            >
              Edit Profile
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveChanges}
          initialValues={{
            username: userData.username,
            bio: userData.bio,
            birthday: userData.birthday ? moment(userData.birthday) : undefined,
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Birthday" name="birthday">
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              placeholder="Select your birthday"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Save Changes
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
