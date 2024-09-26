import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
export const getMoreFilter = createAsyncThunk(
  'getMoreFilter',
  async authToken => {
    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', authToken);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    return fetch(BASEURl + 'webapi/v1/SubFilter/', requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log('SubFilter result', result);
        return result;
      })
      .catch(error => {
        console.log('SubFilter error', error);
        return error;
      });

    // return await getAPI(BASEURl + 'webapi/v1/SubFilter/')
    //   .then(async response => {
    //     // console.log('SubFilter response', response);
    //     const {data} = response;
    //     return data;
    //   })
    //   .catch(e => {
    //     // console.log('SubFilter Error', e);
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //     return data;
    //   });
  },
);
const getMoreFilterSlice = createSlice({
  name: 'getMoreFilter',
  initialState: {
    getMoreFilterData: [],
    status: null,
  },
  extraReducers: {
    [getMoreFilter.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getMoreFilter.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getMoreFilterData = action.payload;
    },
    [getMoreFilter.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getMoreFilterSlice.reducer;
