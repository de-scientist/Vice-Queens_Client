import React, { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  fetchCategories,
  createCategory,
  editCategory,
} from "../../store/slices/category";

interface Category {
  id: string;
  name: string;
  description: string;
}

const EditWebContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector(
    (state: RootState) => state.category,
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSaveCategory = async () => {
    if (editingCategory) {
      dispatch(editCategory(editingCategory));
      setEditingCategory(null);
    }
  };

  const handleCreateCategory = async () => {
    dispatch(createCategory(newCategory));
    setShowPopup(false);
    setNewCategory({ name: "", description: "" });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ul className="space-y-2">
            {categories?.map((category: Category) => (
              <li key={category.id} className="flex items-center space-x-4">
                <Input
                  type="text"
                  value={
                    editingCategory?.id === category.id
                      ? editingCategory.name
                      : category.name
                  }
                  onChange={(e) =>
                    setEditingCategory({ ...category, name: e.target.value })
                  }
                  className="flex-1"
                />
                <Input
                  type="text"
                  value={
                    editingCategory?.id === category.id
                      ? editingCategory.description
                      : category.description
                  }
                  onChange={(e) =>
                    setEditingCategory({
                      ...category,
                      description: e.target.value,
                    })
                  }
                  className="flex-1"
                />
                <Button
                  onClick={() => handleEditCategory(category)}
                  className="bg-blue-500 text-white"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleSaveCategory}
                  className="bg-green-500 text-white"
                >
                  Save
                </Button>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => setShowPopup(true)}
            className="mt-4 bg-blue-500 text-white"
          >
            Add New Category
          </Button>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Category</h2>
            <Input
              type="text"
              placeholder="Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              className="mb-4"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateCategory}
                className="bg-green-500 text-white"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditWebContent;
