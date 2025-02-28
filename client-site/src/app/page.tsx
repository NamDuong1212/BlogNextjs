"use client";
import { ViewOnlyPostList } from "./components/ViewOnlyPostList";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between py-12 px-6 md:px-20">
      <div className="h-screen left-0 top-0 sticky p-5 flex flex-col gap-10 bg-white">
        <div className="flex-1 overflow-auto">
          <ViewOnlyPostList />
        </div>
      </div>
    </div>
  );
}
