import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
export const getPopertiesDetails = createAsyncThunk(
  'getPropertiesDetails',
  async data => {
    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', data?.authToken);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    return fetch(
      BASEURl + 'webapi/v1/singleproperty/?post_id=' + data?.postid,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log('singleproperty result', result);
        return result;
      })
      .catch(error => {
        console.log('singleproperty error', error);
        return error;
      });

    // const urlDynamic = BASEURl + 'webapi/v1/singleproperty/?post_id=' + postid;
    // return await getAPI(urlDynamic)
    //   .then(async response => {
    //     console.log('singleproperty response', response);
    //     const {data} = response;
    //     return data;
    //   })
    //   .catch(e => {
    //     console.log('singleproperty e', e);
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);

const getPopertiesDetailsSlice = createSlice({
  name: 'getPopertiesDetails',
  initialState: {
    getPopertiesDetails: [],
    status: null,
  },
  extraReducers: {
    [getPopertiesDetails.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getPopertiesDetails.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getPopertiesDetails = action.payload;
    },
    [getPopertiesDetails.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getPopertiesDetailsSlice.reducer;
