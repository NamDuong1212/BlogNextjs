"use client";

import WalletDailyTable from "@/app/components/WalletDailyTable";

export default function WalletPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Thu nhập hàng ngày</h1>
      <WalletDailyTable />
    </div>
  );
}
