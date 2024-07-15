import { createSlice } from '@reduxjs/toolkit';

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    error: null,
  },
  reducers: {
    fetchFilesSuccess: (state, action) => {
      try {
        const data = JSON.stringify(action.payload);
        state.files = action.payload;
        state.error = null;
      } catch (error) {
        console.error('Error while logging data:', error);
      }
    },
    fetchFilesFailure: (state, action) => {
      try {
        const errorData = JSON.stringify(action.payload);
        console.log('Error received in files reducer:', errorData);
        state.error = { message: action.payload.message, stack: action.payload.stack };
      } catch (error) {
        console.error('Error while logging error:', error);
      }
    },
  },
});

export const { fetchFilesSuccess, fetchFilesFailure } = filesSlice.actions;
export default filesSlice.reducer;
