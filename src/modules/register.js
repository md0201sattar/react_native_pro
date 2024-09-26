import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';

export const register = createAsyncThunk('register', async dispatch => {
  console.log('register', dispatch);
  return await uploadImageAPI(BASEURl + 'webapi/v1/register/', dispatch)
    .then(async response => {
      console.log('reg response', response);
      const {data} = response;

      return data;
    })
    .catch(e => {
      console.log('reg ERRor', e);
      if (e.response) {
      } else if (e.request) {
      } else {
      }
      return data;
    });
});

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    registerData: [],
    status: null,
  },
  extraReducers: {
    [register.pending]: (state, action) => {
      state.status = 'loading';
      state.registerData = action.payload;
    },
    [register.fulfilled]: (state, action) => {
      state.status = 'success';
      state.registerData = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.status = 'failed';
      state.registerData = action.payload;
    },
  },
});

export default registerSlice.reducer;
