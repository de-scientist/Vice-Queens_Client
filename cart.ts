import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import {
  addQuantity,
  deleteQuantity,
  addToCart,
  checkout,
} from "../../utils/api.ts";

interface CartItem {
  id: string;
  name: string;
  currentPrice: number;
  previousPrice?: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },
    subtractItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem && existingItem.quantity - action.payload.quantity > 0) {
        existingItem.quantity -= action.payload.quantity;
      } else {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        );
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  clearCart,
  subtractItemQuantity,
} = cartSlice.actions;

const persistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartSlice.reducer);

export default persistedCartReducer;

// Thunks
export const addQuantityToCart =
  (
    productId: string,
    quantity: number,
    name: string,
    currentPrice: number,
    imageUrl: string,
    previousPrice?: number,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      await addQuantity(productId, quantity);

      const state = getState();
      const existingItem = state.cart.items.find((item) => item.id === productId);
      
      dispatch(
        addItemToCart({
          id: productId,
          name: existingItem ? existingItem.name : name,
          currentPrice: existingItem ? existingItem.currentPrice : currentPrice,
          previousPrice: existingItem ? existingItem.previousPrice : previousPrice,
          imageUrl: existingItem ? existingItem.imageUrl : imageUrl,
          quantity,
        }),
      );
    } catch (error) {
      console.error("Error adding quantity to cart:", error);
    }
  };

export const deleteQuantityFromCart =
  (productId: string, quantity: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const existingItem = state.cart.items.find((item) => item.id === productId);

      if (!existingItem) return;

      const newQuantity = existingItem.quantity - quantity;
      
      await deleteQuantity(productId, quantity);

      if (newQuantity > 0) {
        dispatch(subtractItemQuantity({ id: productId, quantity }));
      } else {
        dispatch(removeItemFromCart(productId));
      }
    } catch (error) {
      console.error("Error deleting quantity from cart:", error);
    }
  };

export const addToCartThunk =
  (
    productId: string,
    quantity: number,
    name: string,
    currentPrice: number,
    imageUrl: string,
    previousPrice?: number,
  ): AppThunk =>
  async (dispatch) => {
    try {
      await addToCart(productId, quantity);
      dispatch(
        addItemToCart({
          id: productId,
          quantity,
          name,
          currentPrice,
          previousPrice,
          imageUrl,
        }),
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

export const checkoutCart =
  (orderData: {
    totalAmount: number;
    status: string;
    orderItems: Array<{ productId: string; quantity: number }>;
  }): AppThunk =>
  async (dispatch) => {
    try {
      await checkout(orderData);
      dispatch(clearCart());
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

export const getAllItems = (state: { cart: CartState }) => state.cart.items;

export const getTotalAmount = (state: { cart: CartState }) => {
  return state.cart.items.reduce(
    (total, item) => total + item.currentPrice * item.quantity,
    0,
  );
};

export const getTotalItems = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};
