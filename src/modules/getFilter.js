import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';

export const getFilter = createAsyncThunk('getFilter', async authToken => {
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', authToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  return fetch(BASEURl + 'webapi/v1/GetFilter', requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log('GetFilter result', result);
      return result;
    })
    .catch(error => {
      console.log('GetFilter error', error);
      return error;
    });

  // return await getAPI(
  //   BASEURl + 'webapi/v1/GetFilter'
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

const getFilterSlice = createSlice({
  name: 'getFilter',
  initialState: {
    getFilterData: [],
    status: null,
  },
  extraReducers: {
    [getFilter.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getFilter.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getFilterData = action.payload;
    },
    [getFilter.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getFilterSlice.reducer;
