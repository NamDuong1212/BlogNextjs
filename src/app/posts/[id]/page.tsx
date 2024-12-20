"use client";

import React, { useState } from "react";
import { Avatar, List, Button, Input, Typography, Space } from "antd";
import { Comment } from "@ant-design/compatible";
import {HeartOutlined,HeartFilled,MessageOutlined,CalendarOutlined,UserOutlined} from "@ant-design/icons";
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const PostDetail = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(120);
  const [postComments, setPostComments] = useState([
    {
      user: { name: "asdasd" },
      content: "asdasdddddddddddddd",
      createdAt: "2024-12-18T12:00:00Z",
    },
    {
      user: { name: "hdfg" },
      content: "asdasddddd",
      createdAt: "2024-12-17T15:30:00Z",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setPostLikes(isLiked ? postLikes - 1 : postLikes + 1);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const fakeNewComment = {
      user: { name: "Current User" },
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    setPostComments([...postComments, fakeNewComment]);
    setNewComment("");
  };

  const post = {
    title: "Edible mushrooms",
    author: "Professor X",
    category: "Biology",
    createdAt: "2024-12-15T10:00:00Z",
    content:
      "Commercially important, edible mushrooms include portobellos (Agaricus bisporus), whose forms include button mushrooms, cremini, and baby bellas, and shiitake (Lentinula edodes). The morels (Morchella, Verpa) and false morels or lorchels (Gyromitra, Helvella) are popularly included with the true mushrooms because of their shape and fleshy structure; they resemble a deeply folded or pitted conelike sponge at the top of a hollow stem. Some are among the most highly prized edible fungi (e.g., Morchella esculenta). Edible truffles (various Tuber species), which hardly resemble mushrooms, are also popularly labeled as such. These and other edible mushrooms and fungi are free of cholesterol and contain small amounts of essential amino acids and B vitamins. However, their chief worth is as a specialty food of delicate, subtle flavour and agreeable texture. By fresh weight, the common commercially grown mushroom is more than 90 percent water, less than 3 percent protein, less than 5 percent carbohydrate, less than 1 percent fat, and about 1 percent mineral salts and vitamins.",
    image: null,
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar
            src="https://i.imgur.com/CzXTtJV.jpg"
            size={64}
            icon={<UserOutlined />}
            style={{ marginBottom: "10px" }}
          />
          <Title level={4}>{post.author}</Title>
          <Paragraph>
            <Space>
              <span>{post.category}</span>
              <span>
                <CalendarOutlined /> {formatDateTime(post.createdAt)}
              </span>
            </Space>
          </Paragraph>
        </div>

        <Title level={2} style={{ textAlign: "center" }}>
          {post.title}
        </Title>

        <div style={{ textAlign: "center" }}>
          <img
            src={
              post.image ||
              "https://farm2.staticflickr.com/1449/24800673529_64272a66ec_z_d.jpg"
            }
            alt="Post"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>

        <Paragraph>{post.content}</Paragraph>

        <div style={{ textAlign: "center", fontSize: "16px" }}>
          <Space size="large">
            <span onClick={handleLike} style={{ cursor: "pointer" }}>
              {isLiked ? (
                <HeartFilled style={{ color: "#ff4d4f" }} />
              ) : (
                <HeartOutlined />
              )}
              <span style={{ marginLeft: "8px" }}>{postLikes}</span>
            </span>
            <span>
              <MessageOutlined />{" "}
              <span style={{ marginLeft: "8px" }}>{postComments.length}</span>
            </span>
          </Space>
        </div>

        <div>
          <Title level={4}>Comments</Title>
          <List
            dataSource={postComments}
            header={`${postComments.length} ${postComments.length > 1 ? "comments" : "comment"}`}
            itemLayout="horizontal"
            renderItem={(item) => (
              <Comment
                author={item.user.name}
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#87d068" }}
                  />
                }
                content={item.content}
                datetime={formatDateTime(item.createdAt)}
              />
            )}
          />
          <div style={{ marginTop: "20px" }}>
            <TextArea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button
              type="primary"
              onClick={handleCommentSubmit}
              style={{ marginTop: "10px" }}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </Space>
    </div>
  );
};

export default PostDetail;
