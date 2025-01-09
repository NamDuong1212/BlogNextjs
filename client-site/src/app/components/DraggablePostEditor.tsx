import React, { useState, useRef } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { ContentLayout } from "../types/post";

const { Dragger } = Upload;

interface DraggablePostEditorProps {
  initialLayout?: ContentLayout[];
  onChange: (layout: ContentLayout[]) => void;
}

const DraggablePostEditor: React.FC<DraggablePostEditorProps> = ({
  initialLayout = [],
  onChange,
}) => {
  const [layout, setLayout] = useState<ContentLayout[]>(initialLayout);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rect = editorRef.current?.getBoundingClientRect();
        if (rect) {
          const newLayout = [...layout];
          newLayout.push({
            type: "image",
            content: event.target?.result as string,
            position: {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            },
          });
          setLayout(newLayout);
          onChange(newLayout);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={editorRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        position: "relative",
        minHeight: "400px",
        border: "1px dashed #d9d9d9",
      }}
    >
      {layout.map((item, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: item.position.x,
            top: item.position.y,
          }}
        >
          {item.type === "image" && (
            <img
              src={item.content}
              alt=""
              style={{ maxWidth: "200px", cursor: "move" }}
              draggable
            />
          )}
          {item.type === "text" && (
            <div style={{ cursor: "move" }}>{item.content}</div>
          )}
        </div>
      ))}
      <Dragger
        showUploadList={false}
        beforeUpload={() => false}
        style={{ padding: "20px" }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag images here</p>
      </Dragger>
    </div>
  );
};

export default DraggablePostEditor;
