import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

//add
export const postRating = createAsyncThunk('postRating', async formData => {
  //
  console.log('formData', formData, formData?.formData);
  const userDetails = await getUserDetailsSync();
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow',
  };

  console.log('requestOptions', requestOptions);

  return fetch(BASEURl + `webapi/v1/rating/`, requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('rating response', response);
      return response;
    })

    .catch(error => {
      console.log('rating Error', error);
      return error;
    });

  // try {
  //   const response = await uploadImageAPI(
  //     BASEURl + `webapi/v1/rating/`,
  //     formData?.formData,
  //   )
  //     .then(res => {
  //       console.log('postRating res', res);
  //       return res;
  //     })
  //     .catch(e => {
  //       console.log('postRating Error', e);
  //       return e;
  //     });
  //   return response;
  // } catch (error) {
  //   throw error;
  // }
});

const postRatingSlice = createSlice({
  name: 'postRating',
  initialState: {
    postRatingData: [],
    status: null,
  },
  extraReducers: {
    [postRating.pending]: (state, action) => {
      state.status = 'loading';
      state.postRatingData = action.payload;
    },
    [postRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.postRatingData = action.payload;
    },
    [postRating.rejected]: (state, action) => {
      state.status = 'failed';
      state.postRatingData = action.payload;
    },
  },
});

export default postRatingSlice.reducer;
