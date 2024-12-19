import React from "react";
import CreateCategory from "@/app/components/createCategory";
import CategoryList from "@/app/components/categoryList";
import UpdateCategory from "@/app/components/updateCategory";


const Category = () => {
  return (
    <div>
      <CreateCategory />
      <CategoryList/>
      <UpdateCategory/>
    </div>
  );
};

export default Category;
