import { createSlice } from "@reduxjs/toolkit";

type ComplianceState = {
  complianceAccepted: boolean;
};

const initialState: ComplianceState = {
  complianceAccepted: false,
};

const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {
    acceptCompliance(state) {
      state.complianceAccepted = true;
    },
    resetCompliance(state) {
      state.complianceAccepted = false;
    },
  },
});

export const { acceptCompliance, resetCompliance } = complianceSlice.actions;
export default complianceSlice.reducer;
