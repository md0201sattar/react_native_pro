import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const postUpdateRating = createAsyncThunk(
  'postUpdateRating',
  async dispatch => {
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
    return fetch(BASEURl + 'webapi/v1/rating/update_rating.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        // console.log('update_rating response', response);
        return response;
      })

      .catch(error => {
        console.log('update_rating Error', error);
        return error;
      });

    // return await uploadImageAPI( BASEURl + 'webapi/v1/rating/update_rating.php', dispatch,)
    //   .then(async response => {
    //     return response;
    //   })
    //   .catch(e => {
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);

const postUpdateRatingSlice = createSlice({
  name: 'postUpdateRating',
  initialState: {
    postUpdateRatingData: [],
    status: null,
  },
  extraReducers: {
    [postUpdateRating.pending]: (state, action) => {
      state.status = 'loading';
      state.postUpdateRatingData = action.payload;
    },
    [postUpdateRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.postUpdateRatingData = action.payload;
    },
    [postUpdateRating.rejected]: (state, action) => {
      state.status = 'failed';
      state.postUpdateRatingData = action.payload;
    },
  },
});

export default postUpdateRatingSlice.reducer;
