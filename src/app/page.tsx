"use client";
import Image from "next/image";
import { ViewOnlyPostList } from "./components/ViewOnlyPostList";
export default function Home() {
  return (
    <div className="">
      <div className="basis-full flex flex-col justify-start ">
        <p className="special-word text-xs">
          You found the right place for knowledge
        </p>
        <h1 className="pb-5">
          Our <span className="special-word">VJU</span>
          <br />
          Blog
        </h1>
        <p>
          Stories are the threads that weave us together; your blog is where
          those threads become a tapestry of shared experiences.
        </p>
      </div>
      <div className="md:block basis-1/3">
        <Image
          src={""}
          alt="VJU"
          sizes="100vw"
          className="w-full h-auto rounded-lg"
        />
      </div>
      <div>
        <ViewOnlyPostList />
      </div>
    </div>
  );
}
