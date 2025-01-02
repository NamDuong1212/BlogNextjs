"use client";
import React, { useState } from "react";
import { Space, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
  const { useUpdatePost, useUploadPostImage } = usePost();
  const updateMutation = useUpdatePost();
  const uploadMutation = useUploadPostImage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [updateData, setUpdateData] = React.useState<Partial<Post>>({
    title: post.title,
    content: post.content,
    image: post.image,
  });

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    setSelectedFile(file);
    return false;
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(
        { ...updateData, id: post.id },
        {
          onSuccess: async () => {
            if (selectedFile) {
              await uploadMutation.mutateAsync({
                id: post.id,
                file: selectedFile,
              });
            }
            onSave();
          },
          onError: () => {
            onCancel();
          },
        },
      );
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post");
    }
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
        style={{ marginBottom: 10 }}
      />

      <Upload
        beforeUpload={beforeUpload}
        maxCount={1}
        accept="image/*"
        fileList={
          selectedFile
            ? [
                {
                  uid: "-1",
                  name: selectedFile.name,
                  status: "done",
                  url: URL.createObjectURL(selectedFile),
                },
              ]
              : []
        }
        onRemove={() => setSelectedFile(null)}
      >
        <Button icon={<UploadOutlined />} style={{ marginBottom: 10 }}>
          {post.image ? "Change Image" : "Add Image"}
        </Button>
      </Upload>

      <Space>
        <Button
          type="primary"
          onClick={handleSave}
          loading={updateMutation.isPending || uploadMutation.isPending}
        >
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Space>
    </Space>
  );
};

export default EditPostForm;
