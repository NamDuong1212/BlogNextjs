import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="container h-screen flex flex-col gap-5 justify-center items-center">
      <h2>Oops, Not Found URL</h2>
      <Link href="/">Go Back?</Link>
    </div>
  );
};

export default NotFound;
