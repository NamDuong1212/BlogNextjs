import React, { useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Skeleton,
  Empty,
  Carousel,
  Divider,
  Badge,
  Row,
  Col,
  Space,
  Button,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  UnorderedListOutlined,
  PictureOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useItinerary } from "@/app/hooks/useItinerary";
import { formatCurrency } from "@/app/utils/formatCurrency";

const { Title, Text, Paragraph } = Typography;

interface ItineraryDetailProps {
  postId: string | number;
}

// Define types for the data structure
interface ItineraryDay {
  id: string;
  dayNumber: number;
  activities: string;
  image: string;
  budgetMin: string;
  budgetMax: string;
  location: string;
  itineraryId: string;
  createdAt: string;
  updatedAt: string;
}

interface Itinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  estimatedTotalBudgetMin: string;
  estimatedTotalBudgetMax: string;
  currency: string;
  postId: number;
  createdAt: string;
  updatedAt: string;
  days: ItineraryDay[];
}

const ItineraryDetail: React.FC<ItineraryDetailProps> = ({ postId }) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const { useGetItineraryByPostId } = useItinerary();
  const { data: itinerary, isLoading, error } = useGetItineraryByPostId(postId);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get the actual number of days from the days array
  const getActualDaysCount = () => {
    if (!itinerary || !itinerary.days) return 0;
    return itinerary.days.length;
  };

  // Navigate through days
  const navigateDay = (direction: "prev" | "next") => {
    if (!itinerary) return;
    const actualDaysCount = getActualDaysCount();
    
    if (direction === "prev" && currentDay > 1) {
      setCurrentDay(currentDay - 1);
    } else if (direction === "next" && currentDay < actualDaysCount) {
      setCurrentDay(currentDay + 1);
    }
  };

  // Find current day data
  const getCurrentDayData = () => {
    if (!itinerary || !itinerary.days) return null;
    return itinerary.days.find(day => day.dayNumber === currentDay);
  };

  const currentDayData = getCurrentDayData();
  const actualDaysCount = getActualDaysCount();

  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-xl border-none mb-8">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg rounded-xl border-none mb-8">
        <Empty
          description="Failed to load itinerary"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  if (!itinerary) {
    return null; // No itinerary data for this post
  }

  return (
    <Card 
      className="rounded-xl border-none mb-8"
      title={
        <div className="flex items-center">
          <div className="w-1 h-6 bg-indigo-600 rounded-full mr-2"></div>
          <Title level={4} className="m-0 text-indigo-800 font-bold">
            <UnorderedListOutlined className="mr-2 text-indigo-600" />
            Travel Itinerary
          </Title>
        </div>
      }
    >
      {/* Itinerary Overview */}
      <div className="mb-6">
        <Title level={3} className="text-center text-indigo-800 mb-4">
          {itinerary.title}
        </Title>
        
        <Paragraph className="text-gray-600 text-center mb-4">
          {itinerary.description}
        </Paragraph>
        
        <Row gutter={16} className="text-center">
          <Col xs={24} sm={8}>
            <Card className="bg-indigo-50 border-none">
              <Space direction="vertical" size="small">
                <CalendarOutlined className="text-indigo-600 text-xl" />
                <div>
                  <Text strong>Duration</Text>
                  <div className="text-lg text-indigo-700">{itinerary.totalDays} Days</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={8}>
            <Card className="bg-green-50 border-none">
              <Space direction="vertical" size="small">
                <DollarOutlined className="text-green-600 text-xl" />
                <div>
                  <Text strong>Budget</Text>
                  <div className="text-lg text-green-700">
                    {formatCurrency(parseFloat(itinerary.estimatedTotalBudgetMin), itinerary.currency)} - {formatCurrency(parseFloat(itinerary.estimatedTotalBudgetMax), itinerary.currency)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Estimated total cost
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={8}>
            <Card className="bg-purple-50 border-none">
              <Space direction="vertical" size="small">
                <EnvironmentOutlined className="text-purple-600 text-xl" />
                <div>
                  <Text strong>Locations</Text>
                  <div className="text-lg text-purple-700">
                    {new Set(itinerary.days.map(day => day.location)).size} Locations
                  </div>
                  <div className="text-xs text-gray-500">
                    Across the journey
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
      
      <Divider className="my-6" />
      
      {/* Day Navigation */}
      <div className="flex justify-between items-center mb-4">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigateDay("prev")}
          disabled={currentDay === 1}
          className="border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-400"
        >
          Previous Day
        </Button>
        
        <Badge count={currentDay} color="#4F46E5">
          <Tag 
            color="processing" 
            className="px-4 py-1 text-base"
          >
            Day {currentDay} of {actualDaysCount}
          </Tag>
        </Badge>
        
        <Button
          icon={<RightOutlined />}
          onClick={() => navigateDay("next")}
          disabled={currentDay === actualDaysCount}
          className="border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-400"
        >
          Next Day
        </Button>
      </div>
      
      {/* Day Content */}
      {currentDayData ? (
        <div className="mt-6">
          <Card className="border border-indigo-100 shadow-sm">
            {/* Day Image */}
            {currentDayData.image ? (
              <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={currentDayData.image} 
                  alt={`Day ${currentDayData.dayNumber}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ) : (
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                <PictureOutlined className="text-4xl text-gray-400" />
              </div>
            )}
            
            {/* Location */}
            <div className="mb-4">
              <Title level={5} className="flex items-center text-indigo-700">
                <EnvironmentOutlined className="mr-2" /> Location
              </Title>
              <Text className="text-gray-700">{currentDayData.location || "No location specified"}</Text>
            </div>
            
            {/* Budget */}
            <div className="mb-4">
              <Title level={5} className="flex items-center text-green-700">
                <DollarOutlined className="mr-2" /> Daily Budget
              </Title>
              <Text className="text-gray-700">
                {formatCurrency(parseFloat(currentDayData.budgetMin), itinerary.currency)} - {formatCurrency(parseFloat(currentDayData.budgetMax), itinerary.currency)}
              </Text>
            </div>
            
            {/* Activities */}
            <div>
              <Title level={5} className="flex items-center text-purple-700">
                <UnorderedListOutlined className="mr-2" /> Activities
              </Title>
              <Paragraph className="text-gray-700 whitespace-pre-wrap">
                {currentDayData.activities || "No activities planned for this day"}
              </Paragraph>
            </div>
          </Card>
        </div>
      ) : (
        <Empty 
          description={`No details available for Day ${currentDay}`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
      
      {/* Day Selector */}
      <div className="mt-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {itinerary.days.map((day) => (
            <Tooltip title={`Day ${day.dayNumber}`} key={day.id}>
              <Button
                type={currentDay === day.dayNumber ? "primary" : "default"}
                shape="circle"
                size="small"
                onClick={() => setCurrentDay(day.dayNumber)}
                className={currentDay === day.dayNumber ? "bg-indigo-600" : ""}
              >
                {day.dayNumber}
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ItineraryDetail;