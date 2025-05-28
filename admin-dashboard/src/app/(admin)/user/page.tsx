"use client";

import UserManagementTable from "@/app/components/UserManagementTable";

export default function UserPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagementTable />
    </div>
  );
}
