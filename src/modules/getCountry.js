import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
export const getCountry = createAsyncThunk('getCountry', async () => {
  //
  const userDetails = await getUserDetailsSync();
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  return fetch(
    'https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode',
    requestOptions,
  )
    .then(response => response.json())
    .then(result => {
      console.log('getCountry result', result);
      return result;
    })
    .catch(error => {
      console.log('getCountry error', error);
      return error;
    });

  // return await getAPI(
  //   'https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode',
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
const getCountrySlice = createSlice({
  name: 'getCountry',
  initialState: {
    getCountryData: [],
    status: null,
  },
  extraReducers: {
    [getCountry.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getCountry.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getCountryData = action.payload;
    },
    [getCountry.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});
export default getCountrySlice.reducer;
