/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnalyticsState {
  salesData: any;
  revenueData: any;
  recentOrderData: any;
  lowStockData: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  salesData: null,
  revenueData: null,
  recentOrderData: null,
  lowStockData: null,
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setSalesData(state, action: PayloadAction<any>) {
      state.salesData = action.payload;
    },
    setRevenueData(state, action: PayloadAction<any>) {
      state.revenueData = action.payload;
    },
    setRecentOrdersData(state, action: PayloadAction<any>) {
      state.recentOrderData = action.payload;
    },
    setLowStockData(state, action: PayloadAction<any>) {
      state.lowStockData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  setSalesData,
  setRevenueData,
  setRecentOrdersData,
  setLowStockData,
  setLoading,
  setError,
} = analyticsSlice.actions;
export default analyticsSlice.reducer;
