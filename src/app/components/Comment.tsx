"use client";
import React, { useState } from "react";
import { List, Avatar, Button, Input, Typography, Popconfirm } from "antd";
import { Comment } from "@ant-design/compatible";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useComment } from "../hooks/useComment";
import useAuthStore from "../store/useAuthStore";
import { formatDateTime } from "../utils/formatDateTime";
import { CommentSectionState } from "../types/comment";

const { TextArea } = Input;
const { Title } = Typography;

const CommentSection: React.FC<CommentSectionState> = ({ postId }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  const userData = useAuthStore((state) => state.userData);

  const {
    useGetComments,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
  } = useComment(postId);

  const { data: commentsData = [], isLoading } = useGetComments();
  const comments: any[] = Array.isArray(commentsData) ? commentsData : [];

  const createCommentMutation = useCreateComment(() => {
    setNewComment("");
    setReplyingTo(null);
  });
  const updateCommentMutation = useUpdateComment(() => {
    setEditingComment(null);
    setEditContent("");
  });
  const deleteCommentMutation = useDeleteComment();

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

  const startEditing = (comment: any) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  }

  const actions = (comment: any) => {
    const isOwner = userData && comment.user.id === userData.id;
    return [
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

  return (
    <div style={{ marginTop: "40px" }}>
      <Title level={4}>Comments</Title>
      <List
        loading={isLoading}
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? "comments" : "comment"}`}
        itemLayout="horizontal"
        renderItem={(comment: any) => (
          <Comment
            actions={actions(comment)}
            author={comment.user.username}
            avatar={
              comment.user.avatar ? (
                <Avatar src={comment.user.avatar} />
              ) : (
                <Avatar src="https://i.imgur.com/OB0y6MR.jpg" />
              )
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
                    {updateCommentMutation.isPending ? "Loading..." : "Finish"}
                  </Button>
                  <Button onClick={() => setEditingComment(null)}>Cancel</Button>
                </div>
              ) : (
                comment.content
              )
            }
            datetime={formatDateTime(comment.createdAt)}
          />
        )}
      />
      {userData ? (
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
            loading={createCommentMutation.isPending}
          >
            Post Comment
          </Button>
        </div>
      ) : (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          Please log in to post comments.
        </div>
      )}
    </div>
  );
};

export default CommentSection;
