"use client";
import { ViewOnlyPostList } from "./components/ViewOnlyPostList";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between py-12 px-6 md:px-20">
      <div className="flex flex-col justify-start space-y-4 md:w-2/3 sticky top-0">
        <p className="text-sm font-semibold text-gray-600">
          You found the right place for knowledge
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 pb-4">
          Our <span className="text-blue-600">Mirai</span>
          <br />
          Blog
        </h1>
        <p className="text-lg text-gray-700 flex flex-col space-y-2">
          Stories are the threads that weave us together; your blog is where
          those threads become a tapestry of shared experiences.
        </p>
      </div>

      <div className="h-screen left-0 top-0 sticky p-5 flex flex-col gap-10 bg-white">
        <div className="flex-1 overflow-auto">
          <ViewOnlyPostList />
        </div>
      </div>
    </div>
  );
}
