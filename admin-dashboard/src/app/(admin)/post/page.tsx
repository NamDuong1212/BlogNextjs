"use client";

import PostTable from "@/app/components/PostTable";

export default function PostPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Bài viết</h1>
      <PostTable />
    </div>
  );
}
