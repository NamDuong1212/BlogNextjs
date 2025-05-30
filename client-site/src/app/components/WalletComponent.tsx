import React, { useState } from "react";
import {
  Card,
  Button,
  Input,
  Progress,
  Spin,
  Typography,
  Modal,
  Form,
  Table,
  Tag,
  Tooltip,
  Space,
  Divider,
  Alert,
  InputNumber,
} from "antd";
import {
  WalletOutlined,
  BankOutlined,
  DollarOutlined,
  SendOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  LinkOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useWallet } from "../hooks/useWallet";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

interface WalletComponentProps {
  userId: string;
  isCreator: boolean;
}

const WalletComponent: React.FC<WalletComponentProps> = ({
  userId,
  isCreator,
}) => {
  const {
    useCreateWallet,
    useGetWalletByUserId,
    useRequestWithdrawal,
    useLinkPayPal,
    useGetWithdrawalHistory,
  } = useWallet(userId);

  const { data: walletData, isPending: isWalletPending } =
    useGetWalletByUserId();
  const { data: withdrawalHistory, isPending: isHistoryPending } =
    useGetWithdrawalHistory();

  const createWalletMutation = useCreateWallet();
  const requestWithdrawalMutation = useRequestWithdrawal();
  const linkPayPalMutation = useLinkPayPal();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [paypalForm] = Form.useForm();
  const [withdrawalForm] = Form.useForm();

  const handleCreateWallet = async () => {
    try {
      await createWalletMutation.mutateAsync();
      toast.success("Wallet created successfully!");
    } catch (error) {
      toast.error("Unable to create wallet, please try again later.");
    }
  };

  const handleLinkPayPal = async (values: { paypalEmail: string }) => {
    try {
      await linkPayPalMutation.mutateAsync(values);
      setIsPayPalModalOpen(false);
      paypalForm.resetFields();
    } catch (error) {
      // Error handled by the hook
    }
  };

  const handleRequestWithdrawal = async (values: { amount: number }) => {
    if (!walletData?.paypalEmail) {
      toast.error("Please link your PayPal account first");
      return;
    }

    try {
      await requestWithdrawalMutation.mutateAsync({ amount: values.amount });
      setIsWithdrawalModalOpen(false);
      withdrawalForm.resetFields();
      setWithdrawAmount(0);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "PROCESSING":
        return "blue";
      case "PENDING":
        return "orange";
      case "FAILED":
        return "red";
      default:
        return "default";
    }
  };

  const withdrawalColumns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <Text strong>${amount.toFixed(2)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "PayPal Email",
      dataIndex: "paypalEmail",
      key: "paypalEmail",
      render: (email: string) => <Text type="secondary">{email}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Failure Reason",
      dataIndex: "failureReason",
      key: "failureReason",
      render: (reason: string) =>
        reason ? (
          <Tooltip title={reason}>
            <Text type="danger" ellipsis style={{ maxWidth: 100 }}>
              {reason}
            </Text>
          </Tooltip>
        ) : (
          "-"
        ),
    },
  ];

  if (!isCreator) {
    return (
      <Card
        className="shadow-md rounded-xl"
        bordered={false}
        title={
          <div className="flex items-center gap-2">
            <WalletOutlined className="text-blue-500" />
            <span>Wallet Access</span>
          </div>
        }
      >
        <div className="text-center py-6">
          <InfoCircleOutlined className="text-4xl text-gray-300 mb-4" />
          <Paragraph>You do not have wallet access</Paragraph>
          <Text type="secondary">Only creators can access wallet features</Text>
        </div>
      </Card>
    );
  }

  if (isWalletPending) {
    return (
      <Card
        className="shadow-md rounded-xl"
        bordered={false}
        title={
          <div className="flex items-center gap-2">
            <WalletOutlined className="text-blue-500" />
            <span>My Wallet</span>
          </div>
        }
      >
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!walletData) {
    return (
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
      </Card>
    );
  }

  return (
    <>
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WalletOutlined className="text-blue-500" />
              <span>My Wallet</span>
            </div>
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={() => setIsHistoryModalOpen(true)}
            >
              History
            </Button>
          </div>
        }
        className="shadow-md rounded-xl"
        bordered={false}
      >
        <div className="space-y-4">
          {/* Balance Display */}
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

          {/* PayPal Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <Text strong>PayPal Account</Text>
                <br />
                {walletData.paypalEmail ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Text type="secondary">{walletData.paypalEmail}</Text>
                    {walletData.paypalVerified && (
                      <Tag color="green">Verified</Tag>
                    )}
                  </div>
                ) : (
                  <Text type="secondary">Not linked</Text>
                )}
              </div>
              <Button
                type={walletData.paypalEmail ? "default" : "primary"}
                icon={<LinkOutlined />}
                onClick={() => setIsPayPalModalOpen(true)}
                size="small"
              >
                {walletData.paypalEmail ? "Update" : "Link PayPal"}
              </Button>
            </div>
          </div>

          {/* Withdrawal Section */}
          <Divider />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Text strong>Withdrawal</Text>
              <Text type="secondary" className="text-sm">
                Min: $5.00
              </Text>
            </div>

            {!walletData.paypalEmail && (
              <Alert
                message="Link your PayPal account to enable withdrawals"
                type="warning"
                showIcon
                className="mb-3"
              />
            )}

            <Button
              type="primary"
              block
              onClick={() => setIsWithdrawalModalOpen(true)}
              disabled={!walletData.paypalEmail || walletData.balance < 5}
              icon={<SendOutlined />}
              size="large"
            >
              Request Withdrawal
            </Button>
          </div>
        </div>
      </Card>

      {/* PayPal Linking Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <LinkOutlined className="text-blue-500" />
            <span>Link PayPal Account</span>
          </div>
        }
        open={isPayPalModalOpen}
        onCancel={() => setIsPayPalModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={paypalForm}
          layout="vertical"
          onFinish={handleLinkPayPal}
          initialValues={{ paypalEmail: walletData.paypalEmail }}
        >
          <Form.Item
            label="PayPal Email Address"
            name="paypalEmail"
            rules={[
              { required: true, message: "Please enter your PayPal email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your PayPal email"
            />
          </Form.Item>

          <Alert
            message="Important"
            description="Make sure this email matches your PayPal account email to receive payments successfully."
            type="info"
            showIcon
            className="mb-4"
          />

          <div className="flex gap-3">
            <Button
              onClick={() => setIsPayPalModalOpen(false)}
              size="large"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={linkPayPalMutation.isPending}
              className="flex-1"
            >
              {walletData.paypalEmail ? "Update" : "Link"} PayPal
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Withdrawal Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SendOutlined className="text-blue-500" />
            <span>Request Withdrawal</span>
          </div>
        }
        open={isWithdrawalModalOpen}
        onCancel={() => setIsWithdrawalModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={withdrawalForm}
          layout="vertical"
          onFinish={handleRequestWithdrawal}
        >
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <Text strong>
              Available Balance: ${walletData.balance.toFixed(2)}
            </Text>
            <br />
            <Text type="secondary">PayPal: {walletData.paypalEmail}</Text>
          </div>

          <Form.Item
            label="Withdrawal Amount"
            name="amount"
            rules={[
              { required: true, message: "Please enter withdrawal amount" },
              {
                type: "number",
                min: 5,
                max: walletData.balance,
                message: `Amount must be between $5.00 and $${walletData.balance.toFixed(2)}`,
              },
            ]}
          >
            <InputNumber
              min={5}
              max={walletData.balance}
              step={0.01}
              precision={2}
              addonBefore={<DollarOutlined className="text-gray-400" />}
              addonAfter="USD"
              size="large"
              placeholder="Enter amount"
              style={{ width: "100%" }}
              onChange={(value) => setWithdrawAmount(Number(value) || 0)}
            />
          </Form.Item>

          {withdrawAmount > 0 && (
            <Progress
              percent={(withdrawAmount / walletData.balance) * 100}
              showInfo={false}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              className="mb-4"
            />
          )}

          <Alert
            message="Processing Time"
            description="Withdrawals are processed via PayPal and may take 1-3 business days to complete."
            type="info"
            showIcon
            className="mb-4"
          />

          <div className="flex gap-3">
            <Button
              onClick={() => setIsWithdrawalModalOpen(false)}
              size="large"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={requestWithdrawalMutation.isPending}
              className="flex-1"
            >
              Request Withdrawal
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Withdrawal History Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-blue-500" />
            <span>Withdrawal History</span>
          </div>
        }
        open={isHistoryModalOpen}
        onCancel={() => setIsHistoryModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        {isHistoryPending ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={withdrawalHistory}
            columns={withdrawalColumns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: "No withdrawal history found",
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default WalletComponent;
