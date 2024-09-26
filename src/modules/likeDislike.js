import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const likeDisLike = createAsyncThunk('likeDisLike', async dispatch => {
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

  return fetch(
    BASEURl + 'webapi/v1/rewards/like_dislike_challenge.php',
    requestOptions,
  )
    .then(response => response.json())
    .then(response => {
      console.log('like_dislike_challenge response', response);
      return response;
    })

    .catch(error => {
      console.log('like_dislike_challenge Error', error);
      return error;
    });

  // return await uploadImageAPI(
  //   BASEURl+'webapi/v1/rewards/like_dislike_challenge.php',
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

const likeDisLikeSlice = createSlice({
  name: 'likeDisLike',
  initialState: {
    likeDisLikeData: [],
    status: null,
  },
  extraReducers: {
    [likeDisLike.pending]: (state, action) => {
      state.status = 'loading';
    },
    [likeDisLike.fulfilled]: (state, action) => {
      state.status = 'success';
      state.likeDisLikeData = action.payload;
    },
    [likeDisLike.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default likeDisLikeSlice.reducer;
