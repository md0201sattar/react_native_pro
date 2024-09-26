import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const getNearBy = createAsyncThunk('getNearBy', async payload => {
  const userDetails = await getUserDetailsSync();
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: payload,
    redirect: 'follow',
  };

  return fetch(BASEURl + 'webapi/v1/nearby/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('nearby response', response);
      return response;
    })

    .catch(error => {
      console.log('nearby Error', error);
      return error;
    });

  // return await uploadImageAPI(
  //   BASEURl+'webapi/v1/nearby/',
  //   payload,
  // )
  //   .then(async response => {
  //     const {data} = response;
  //     return data;
  //   })
  //   .catch(e => {
  //     if (e.response) {
  //     } else if (e.request) {
  //     } else {
  //     }
  //   });
});

const getNearBySlice = createSlice({
  name: 'getNearBy',
  initialState: {
    getNearByData: [],
    status: null,
  },
  extraReducers: {
    [getNearBy.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getNearBy.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getNearByData = action.payload;
    },
    [getNearBy.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getNearBySlice.reducer;
