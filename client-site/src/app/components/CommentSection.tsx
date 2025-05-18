"use client";
import React, { useState } from "react";
import { List, Button, Input, Typography, Popconfirm } from "antd";
import { Comment } from "@ant-design/compatible";
import {
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useComment } from "../hooks/useComment";
import useAuthStore from "../store/useAuthStore";
import { formatDateTime } from "../utils/formatDateTime";
import { CommentSectionState } from "../types/comment";
import ImageComponentAvatar from "./ImageComponentAvatar";

const { TextArea } = Input;
const { Title } = Typography;

const CommentSection: React.FC<CommentSectionState> = ({ postId }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");

  const userData = useAuthStore((state) => state.userData);
  const {
    useGetComments,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
    useReplyComment,
  } = useComment(postId);

  const { data: comments = [], isLoading } = useGetComments();

  const createCommentMutation = useCreateComment(() => {
    setNewComment("");
    setReplyingTo(null);
  });

  const updateCommentMutation = useUpdateComment(() => {
    setEditingComment(null);
    setEditContent("");
  });

  const deleteCommentMutation = useDeleteComment();

  const replyCommentMutation = useReplyComment(() => {
    setReplyContent("");
    setReplyingTo(null);
  });

  const handleCommentSubmit = () => {
    if (!newComment.trim() || !userData) return;
    createCommentMutation.mutate({
      content: newComment,
      postId,
      replyTo: replyingTo?.id || null,
    });
  };

  const handleUpdateComment = () => {
    if (!editContent.trim() || !userData) return;
    updateCommentMutation.mutate({
      id: editingComment!,
      data: { content: editContent },
    });
  };

  const handleReplySubmit = () => {
    if (!replyContent.trim() || !userData || !replyingTo) return;
    replyCommentMutation.mutate({
      parentId: replyingTo.id,
      data: {
        content: replyContent,
      },
    });
  };

  const startEditing = (comment: any) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const actions = (comment: any) => {
    const isOwner = userData && comment.user.id === userData.id;
    return [
      <Button
        key="reply"
        type="link"
        onClick={() =>
          setReplyingTo({ id: comment.id, username: comment.user.username })
        }
        icon={<CommentOutlined />}
      >
        Reply
      </Button>,
      isOwner && (
        <EditOutlined key="edit" onClick={() => startEditing(comment)} />
      ),
      isOwner && (
        <Popconfirm
          title="Are you sure you want to delete this comment?"
          onConfirm={() => deleteCommentMutation.mutate(comment.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined key="delete" style={{ color: "#ff4d4f" }} />
        </Popconfirm>
      ),
    ].filter(Boolean);
  };

  const renderReplies = (replies: any[], level: number = 1) => {
    if (!replies || replies.length === 0) return null;

    return replies.map((reply) => (
      <React.Fragment key={reply.id}>
        <div style={{ position: "relative" }}>
          {/* Arrow pointing to the reply */}
          <div 
            style={{ 
              position: "absolute", 
              left: 24 * level, 
              top: "20px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <ArrowRightOutlined style={{ color: "#1890ff" }} />
          </div>
          {renderCommentItem(reply, true, level)}
        </div>
        {replyingTo?.id === reply.id && (
          <div style={{ marginLeft: 48 * (level + 1), marginTop: 16 }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <ImageComponentAvatar
                src={userData?.avatar || "https://i.imgur.com/OB0y6MR.jpg"}
                alt="Your Avatar"
              />
              <TextArea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${replyingTo?.username || ""}...`}
                rows={2}
                style={{ flex: 1 }}
              />
            </div>
            <Button
              type="primary"
              onClick={handleReplySubmit}
              style={{ marginRight: 8 }}
              loading={replyCommentMutation.isPending}
            >
              Reply
            </Button>
            <Button onClick={() => setReplyingTo(null)}>Cancel</Button>
          </div>
        )}
        {renderReplies(reply.replies, level + 1)}
      </React.Fragment>
    ));
  };

  const renderCommentItem = (
    comment: any,
    isReply = false,
    level: number = 1
  ) => (
    <Comment
      key={comment.id}
      actions={actions(comment)}
      author={comment.user.username}
      avatar={
        <ImageComponentAvatar
          src={comment.user.avatar || "https://i.imgur.com/OB0y6MR.jpg"}
          alt="User Avatar"
        />
      }
      content={
        editingComment === comment.id ? (
          <div>
            <TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
            <Button
              type="primary"
              onClick={handleUpdateComment}
              style={{ marginTop: "10px", marginRight: "10px" }}
              loading={updateCommentMutation.isPending}
            >
              {updateCommentMutation.isPending ? "Loading..." : "Update"}
            </Button>
            <Button onClick={() => setEditingComment(null)}>Cancel</Button>
          </div>
        ) : (
          comment.content
        )
      }
      datetime={formatDateTime(comment.createdAt)}
      style={isReply ? { marginLeft: 48 * level } : undefined}
    />
  );

  const countTotalComments = (comments: any[]): number => {
    return comments.reduce((total, comment) => {
      let count = 1;
      if (comment.replies && comment.replies.length > 0) {
        count += countTotalComments(comment.replies);
      }
      return total + count;
    }, 0);
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <Title level={4}>Comments</Title>
      <List
        loading={isLoading}
        dataSource={comments}
        header={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CommentOutlined style={{ fontSize: "20px" }} />
            {`${countTotalComments(comments)} comments`}
          </div>
        }
        itemLayout="horizontal"
        renderItem={(comment: any) => (
          <>
            {renderCommentItem(comment)}
            {replyingTo?.id === comment.id && (
              <div style={{ marginLeft: 48, marginTop: 16 }}>
                <div
                  style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
                >
                  <ImageComponentAvatar
                    src={userData?.avatar || "https://i.imgur.com/OB0y6MR.jpg"}
                    alt="Your Avatar"
                  />
                  <TextArea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${replyingTo?.username || ""}...`}
                    rows={2}
                    style={{ flex: 1 }}
                  />
                </div>
                <Button
                  type="primary"
                  onClick={handleReplySubmit}
                  style={{ marginRight: 8 }}
                  loading={replyCommentMutation.isPending}
                >
                  Reply
                </Button>
                <Button onClick={() => setReplyingTo(null)}>Cancel</Button>
              </div>
            )}
            {renderReplies(comment.replies)}
          </>
        )}
      />
      {userData ? (
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <ImageComponentAvatar
              src={userData.avatar || "https://i.imgur.com/OB0y6MR.jpg"}
              alt="Your Avatar"
            />
            <TextArea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1 }}
            />
          </div>
          <Button
            type="primary"
            onClick={handleCommentSubmit}
            style={{ marginTop: "10px" }}
            loading={createCommentMutation.isPending}
          >
            Submit Comment
          </Button>
        </div>
      ) : (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          Please log in to comment.
        </div>
      )}
    </div>
  );
};

export default CommentSection;