import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchCategories } from "../store/slices/category";

interface Category {
  id: string;
  name: string;
  icon?: string;
}

const Categories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category,
  );
  console.log(dispatch);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const getIcon = (iconName: string) => {
    return (
      FaIcons[iconName as keyof typeof FaIcons] || FaIcons.FaQuestionCircle
    );
  };

  if (loading) {
    return (
      <div className="hidden lg:block h-max w-max rounded-md p-4 shadow-md bg-white sticky top-24">
        <p className="text-center">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="hidden lg:block h-max w-max rounded-md p-4 shadow-md bg-white sticky top-24">
      {error ? (
        <p className="text-center text-red-500">Error loading categories</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category: Category) => {
            const IconComponent = getIcon(category.icon || "FaQuestionCircle");
            return (
              <li key={category.id}>
                <Link
                  to={`/category/${category.id}`}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <IconComponent />
                  <span>{category.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Categories;
