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
  DollarOutlined,
} from "@ant-design/icons";
import useAuthStore from "../store/useAuthStore";
import { useProfile } from "../hooks/useProfile";
import type { RcFile } from "antd/es/upload/interface";
import ImageComponentAvatar from "../components/ImageComponentAvatar";
import { useWallet } from "../hooks/useWallet";
import { toast } from "react-hot-toast";
import Link from "next/link"; // Import Link từ Next.js

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
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">
          Dữ liệu người dùng không hợp lệ, vui lòng đăng nhập
        </p>
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
      message.error("Chỉ có thể tải lên tệp hình ảnh!");
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
      await createWalletMutation.mutateAsync();
    } catch (error) {}
  };

  const handleRequestWithdrawal = async () => {
    try {
      await requestWithdrawalMutation.mutateAsync({ amount: withdrawAmount });
      setWithdrawAmount(0);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Lỗi rút tiền, vui lòng thử lại sau",
      );
    }
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
                  <span className="font-medium">Tên đăng nhập</span>
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
                  <span className="font-medium">Ngày sinh</span>
                </span>
              }
            >
              {userData.birthday
                ? moment(userData.birthday).format("DD-MM-YYYY")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <InfoCircleOutlined className="text-blue-500" />
                  <span className="font-medium">Mô tả</span>
                </span>
              }
            >
              <div className="prose max-w-none">
                {userData.bio || "Không có mô tả"}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <WalletOutlined className="text-blue-500" />
                  <span className="font-medium">Ví</span>
                </span>
              }
            >
              {isWalletPending ? (
                <Spin />
              ) : walletData?.balance !== undefined ? (
                <div className="flex flex-col gap-4">
                  <span>Số dư: {walletData.balance} $</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={walletData.balance}
                      value={withdrawAmount}
                      onChange={(e) =>
                        setWithdrawAmount(Number(e.target.value))
                      }
                      prefix={<DollarOutlined className="text-gray-400" />}
                    />
                  </div>
                  <Button
                    type="default"
                    className="w-50"
                    onClick={handleRequestWithdrawal}
                    loading={requestWithdrawalMutation.isPending}
                    disabled={
                      withdrawAmount <= 0 || withdrawAmount > walletData.balance
                    }
                    icon={<WalletOutlined />}
                  >
                    Rút tiền
                  </Button>
                </div>
              ) : isCreator ? (
                <Button
                  color="primary"
                  variant="outlined"
                  className="w-50"
                  onClick={handleCreateWallet}
                  loading={createWalletMutation.isPending}
                  icon={<WalletOutlined />}
                >
                  Tạo ví
                </Button>
              ) : (
                <span>Bạn không có quyền truy cập ví</span>
              )}
            </Descriptions.Item>
            {isCreator && (
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <EditOutlined className="text-blue-500" />
                  <span className="font-medium">Quản lý bài viết</span>
                </span>
              }
            >
              <Link href="/post-list">
                <Button
                  type="default"
                  size="large"
                  icon={<EditOutlined />}
                  className="w-full"
                >
                </Button>
              </Link>
            </Descriptions.Item>
            )}
          </Descriptions>

          <div className="mt-8 flex justify-center">
            <Button
              type="primary"
              size="large"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              className="px-8 h-12 flex items-center"
            >
              Sửa hồ sơ
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        title="Sửa hồ sơ"
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
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Hãy nhập tên đăng nhập" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="bio">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="birthday">
            <DatePicker
              format="DD-MM-YYYY"
              className="w-full"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
