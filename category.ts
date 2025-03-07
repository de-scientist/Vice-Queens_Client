import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { AppThunk } from "../store";
import axios from "axios";
import initiateToastAlert from "../../utils/Toster";
import apiRequest from "../../utils/axiosInstance";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id,
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategory,
  updateCategory,
} = categorySlice.actions;

const persistConfig = {
  key: "category",
  storage,
};

const persistedCategoryReducer = persistReducer(
  persistConfig,
  categorySlice.reducer,
);

export default persistedCategoryReducer;

// Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      return response.data; // Return fetched data
    } catch (error) {
      // Handle API errors
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);
export const createCategory =
  (category: Category): AppThunk =>
  async (dispatch) => {
    try {
      const response = await apiRequest.post(`/api/categories`, category);
      dispatch(addCategory(response.data));
      initiateToastAlert("Category created successfully", "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";
      initiateToastAlert(errorMessage, "warning");
    }
  };

export const editCategory =
  (category: Category): AppThunk =>
  async (dispatch) => {
    try {
      const response = await apiRequest.put(
        `/api/categories/${category.id}`,
        category,
      );
      dispatch(updateCategory(response.data));
      initiateToastAlert("Category updated successfully", "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";
      initiateToastAlert(errorMessage, "warning");
    }
  };

  