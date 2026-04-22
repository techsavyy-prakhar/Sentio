import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import complianceReducer from "./slices/complianceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    compliance: complianceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
