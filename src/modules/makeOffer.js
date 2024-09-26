import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const makeOffer = createAsyncThunk('makeOffer', async dispatch => {
  //
  const userDetails = await getUserDetailsSync();
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: dispatch,
    redirect: 'follow',
  };

  return fetch(BASEURl + 'webapi/v1/makeoffer/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('makeoffer response', response);
      return response;
    })

    .catch(error => {
      console.log('makeoffer Error', error);
      return error;
    });

  // return await uploadImageAPI(
  //   BASEURl+'webapi/v1/makeoffer/',
  //   dispatch,
  // )
  //   .then(async response => {
  //     const { data } = response;
  //     return data;
  //   })
  //   .catch(e => {
  //     if (e.response) {
  //     } else if (e.request) {
  //     } else {
  //     }
  //   });
});

const makeOfferSlice = createSlice({
  name: 'makeOffer',
  initialState: {
    makeOfferData: [],
    status: null,
  },
  extraReducers: {
    [makeOffer.pending]: (state, action) => {
      state.status = 'loading';
    },
    [makeOffer.fulfilled]: (state, action) => {
      state.status = 'success';
      state.makeOfferData = action.payload;
    },
    [makeOffer.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default makeOfferSlice.reducer;
