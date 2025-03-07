import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  checkoutCart: CartItem[];
}

const initialState: CartState = {
  items: [],
  checkoutCart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCheckoutCart(state, action: PayloadAction<CartItem[]>) {
      state.checkoutCart = action.payload;
    },
    clearCheckoutCart(state) {
      state.checkoutCart = [];
    },
  },
});

export const { setCheckoutCart, clearCheckoutCart } = cartSlice.actions;
export type { CartItem, CartState }; // Export types for use in other files
export default cartSlice.reducer;
