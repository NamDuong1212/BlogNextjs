"use client";
import React from "react";
import { Space, Input, Button } from "antd";
import { Post } from "../types/post";
import { usePost } from "../hooks/usePost";

interface EditPostFormProps {
  post: Post;
  onSave: () => void;
  onCancel: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  post,
  onSave,
  onCancel,
}) => {
  const { useUpdatePost } = usePost();
  const updateMutation = useUpdatePost();
  const [updateData, setUpdateData] = React.useState<Partial<Post>>({
    title: post.title,
    content: post.content,
  });

  const handleSave = () => {
    updateMutation.mutate(
      { ...updateData, id: post.id },
      {
        onSuccess: () => {
          onSave();
        },
        onError: () => {},
      },
    );
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        value={updateData.title || ""}
        onChange={(e) =>
          setUpdateData((prev) => ({ ...prev, title: e.target.value }))
        }
        placeholder="Edit title"
        style={{ marginBottom: 10 }}
      />
      <Input.TextArea
        value={updateData.content || ""}
        onChange={(e) =>
          setUpdateData((prev) => ({ ...prev, content: e.target.value }))
        }
        placeholder="Edit content"
        rows={4}
      />
      <Space>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </Space>
    </Space>
  );
};

export default EditPostForm;
