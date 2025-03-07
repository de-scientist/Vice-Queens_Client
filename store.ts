import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userStore from "../store/slices/user";
import sidebarstore from "./slices/sidebar";
import persistedCartReducer from "./slices/cart";
import persistStore from "redux-persist/lib/persistStore";
import selectedProductReducer from "./slices/selectedProduct";
import editedProductReducer from "./slices/editedProduct";
import persistedCategoryReducer from "./slices/category";
import persistedAuthReducer from "./slices/authStore";
import analyticsReducer from "./slices/analyticsStore";
import productReducer from "./slices/product";
import ordersReducer from "./slices/ordersSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    user: userStore,
    auth: persistedAuthReducer,
    sidebar: sidebarstore,
    cart: persistedCartReducer,
    selectedProduct: selectedProductReducer,
    editedProduct: editedProductReducer,
    category: persistedCategoryReducer,
    analytics: analyticsReducer,
    product: productReducer,
    orders: ordersReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 🚨 Disables serialization check
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
