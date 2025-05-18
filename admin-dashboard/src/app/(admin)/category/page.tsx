"use client";

import CategoryTable from "@/app/components/CategoryTable";

export default function CategoryPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <CategoryTable />
    </div>
  );
}
