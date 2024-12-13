import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api, clearTokken } from '../api/index'

export const getUser = createAsyncThunk("user/details", async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    clearTokken();
    return null;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    clear: () => null,
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getUser.pending, () => null )
      .addCase(getUser.fulfilled, (state, action) => action.payload);
    // .addCase(getUser.rejected, () => null );
  },
});

export const { clear } = userSlice.actions;

export default userSlice.reducer;
