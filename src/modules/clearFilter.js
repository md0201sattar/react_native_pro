import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';

export const clearFilter = createAsyncThunk('clearFilter', async authToken => {
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', authToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  return fetch(BASEURl + 'webapi/v1/AppFilter/clearfilter.php', requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log('clearfilter result', result);
      return result;
    })
    .catch(error => {
      console.log('clearfilter error', error);
      return error;
    });

  // return await getAPI(
  //   BASEURl + 'webapi/v1/AppFilter/clearfilter.php',
  //   '',
  //   '',
  //   '',
  //   authToken,
  // )
  //   .then(async response => {
  //     console.log('clearfilter response', response?.data);
  //     const {data} = response;
  //     return data;
  //   })
  //   .catch(e => {
  //     console.log('clearfilter e', e);
  //     if (e.response) {
  //     } else if (e.request) {
  //     } else {
  //     }
  //   });
});

const clearFilterSlice = createSlice({
  name: 'clearFilter',
  initialState: {
    clearFilterData: [],
    status: null,
  },
  extraReducers: {
    [clearFilter.pending]: (state, action) => {
      state.status = 'loading';
    },
    [clearFilter.fulfilled]: (state, action) => {
      state.status = 'success';
      state.clearFilterData = action.payload;
    },
    [clearFilter.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default clearFilterSlice.reducer;
