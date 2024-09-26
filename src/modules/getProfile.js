import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
//add
export const getProfile = createAsyncThunk('getProfile', async authToken => {
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', authToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  return fetch(BASEURl + 'webapi/v1/userprofile/', requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log('result', result);
      return result;
    })
    .catch(error => {
      // console.log('error', error);
      return error;
    });

  // return await getAPI(BASEURl + 'webapi/v1/userprofile/', authToken)
  //   .then(async response => {
  //     const {data} = response;
  //     console.log('uploadprofile', data);
  //     return data;
  //   })
  //   .catch(e => {
  //     if (e.response) {
  //     } else if (e.request) {
  //     } else {
  //     }
  //   });
});

const getProfileSlice = createSlice({
  name: 'getProfile',
  initialState: {
    getProfileData: [],
    status: null,
  },
  extraReducers: {
    [getProfile.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getProfile.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getProfileData = action.payload;
    },
    [getProfile.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getProfileSlice.reducer;
