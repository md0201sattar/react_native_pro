import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const HandleNotification = createAsyncThunk(
  'HandleNotification',
  async data => {
    try {
      // console.log('data', data);
      const response = data;
      if (response?.notification) {
        // console.log('enter if');
        return response?.notification;
      } else {
        // console.log('enter else');
        return false;
      }
    } catch (error) {
      // console.log('enter Error');
      throw error;
    }
  },
);

const HandleNotificationSlice = createSlice({
  name: 'HandleNotification',
  initialState: {
    HandleNotificationData: false,
    status: null,
  },
  // extraReducers: {
  //   [HandleNotification.pending]: (state, action) => {
  //     console.log('loading', action?.payload);
  //     state.status = 'loading';
  //   },
  //   [HandleNotification.fulfilled]: (state, action) => {
  //     console.log('success', action?.payload);
  //     state.status = 'success';
  //     state.HandleNotificationData = action.payload;
  //   },
  //   [HandleNotification.rejected]: (state, action) => {
  //     console.log('failed', action?.payload);
  //     state.status = 'failed';
  //   },
  // },
  extraReducers: builder => {
    builder

      .addCase(HandleNotification.pending, (state, action) => {
        // console.log('loading', action.payload);
        state.status = 'loading';
      })
      .addCase(HandleNotification.fulfilled, (state, action) => {
        console.log('success', action.payload);
        state.status = 'success';
        state.HandleNotificationData = action.payload;
      })
      .addCase(HandleNotification.rejected, (state, action) => {
        console.log('failed', action.payload);
        state.status = 'failed';
      });
  },
});

export default HandleNotificationSlice.reducer;
