import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories as getCategoriesApi } from '../api/category'

export const getCategories = createAsyncThunk("categories/details", async () => {
  const response = await getCategoriesApi()
  if (response === false) {
    return null
  }
  return response
});

const addCategoryFunc = (state, action) => {
  state.push(action.payload)
};

const removeCategoryFunc = (state, action) => {
  return state.filter(category => category.id !== action.payload);
};

const updateCategoryFunc = (state, action) => {
  const { id, updatedData } = action.payload;
  const index = state.findIndex(category => category.id === id);

  if (index !== -1) {
    state[index] = { ...state[index], ...updatedData };
  }
};


const categorySlice = createSlice({
  name: "categories",
  initialState: null,
  reducers: {
    clear: () => null,
    addCategory: addCategoryFunc,
    removeCategory: removeCategoryFunc,
    updateCategory: updateCategoryFunc,
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getUser.pending, () => null )
      .addCase(getCategories.fulfilled, (state, action) => action.payload);
    // .addCase(getUser.rejected, () => null );
  },
});

export const { clear, addCategory, removeCategory, updateCategory } = categorySlice.actions;

export default categorySlice.reducer;
