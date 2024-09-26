import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
export const getRating = createAsyncThunk('getRating', async post_id => {
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
    BASEURl + `webapi/v1/rating/user_rating.php?post_id=${post_id}`,
    requestOptions,
  )
    .then(response => response.json())
    .then(result => {
      console.log('user_rating result', result);
      return result;
    })
    .catch(error => {
      console.log('user_rating error', error);
      return error;
    });

  // return await getAPI(
  //   BASEURl + `webapi/v1/rating/user_rating.php?post_id=${post_id}`,
  // )
  //   .then(async response => {
  //     console.log('user_rating response', response);
  //     const {data} = response;
  //     return data;
  //   })
  //   .catch(e => {
  //     console.log('user_rating Error', e);
  //     if (e.response) {
  //     } else if (e.request) {
  //     } else {
  //     }
  //   });
});

const getRatingSlice = createSlice({
  name: 'getRating',
  initialState: {
    getRatingData: [],
    status: null,
  },
  extraReducers: {
    [getRating.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getRatingData = action.payload;
    },
    [getRating.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getRatingSlice.reducer;
