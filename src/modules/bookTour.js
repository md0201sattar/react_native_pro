import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const bookTour = createAsyncThunk('bookTour', async dispatch => {
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

  return fetch(BASEURl + 'webapi/v1/rating/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('rating response', response);
      return response;
    })

    .catch(error => {
      console.log('rating Error', error);
      return error;
    });

  // return await uploadImageAPI(
  //   BASEURl + 'webapi/v1/rating/',
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
const bookTourSlice = createSlice({
  name: 'bookTour',
  initialState: {
    bookTourData: [],
    status: null,
  },
  extraReducers: {
    [bookTour.pending]: (state, action) => {
      state.status = 'loading';
    },
    [bookTour.fulfilled]: (state, action) => {
      state.status = 'success';
      state.bookTourData = action.payload;
    },
    [bookTour.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default bookTourSlice.reducer;
