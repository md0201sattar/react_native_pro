import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';

export const emailCheck = createAsyncThunk('emailCheck', async dispatch => {
  return await uploadImageAPI(BASEURl + 'webapi/v1/emailcheck/', dispatch)
    .then(async response => {
      const {data} = response;
      return data;
    })
    .catch(e => {
      console.log('emailcheck error', e);
      if (e.response) {
      } else if (e.request) {
      } else {
      }
      return e;
    });
});

const emailCheckSlice = createSlice({
  name: 'emailCheck',
  initialState: {
    emailCheckData: [],
    status: null,
  },
  extraReducers: {
    [emailCheck.pending]: (state, action) => {
      state.status = 'loading';
    },
    [emailCheck.fulfilled]: (state, action) => {
      state.status = 'success';
      state.emailCheckData = action.payload;
    },
    [emailCheck.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default emailCheckSlice.reducer;
