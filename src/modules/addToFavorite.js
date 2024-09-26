import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const addToFavorite = createAsyncThunk('addToFavorite', async data => {
  const userDetails = await getUserDetailsSync();

  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    redirect: 'follow',
  };

  return fetch(
    BASEURl + `webapi/v1/favorites/addremovefavorite.php`,
    requestOptions,
  )
    .then(response => response.json())
    .then(response => {
      // console.log('addremovefavorite response', response);
      return response;
    })

    .catch(error => {
      console.log('addremovefavorite Error', error);
      return error;
    });

  // try {
  //   const response = await uploadImageAPI(
  //     BASEURl + `webapi/v1/favorites/addremovefavorite.php`,
  //     data?.formData,
  //   )
  //     .then(res => {
  //       console.log('addremovefavorite res', res);
  //       return res;
  //     })
  //     .catch(e => {
  //       console.log('addremovefavorite Error', e);
  //       return e;
  //     });
  //   return response;
  // } catch (error) {
  //   throw error;
  // }
});
const addToFavoriteSlice = createSlice({
  name: 'addToFavorite',
  initialState: {
    addToFavoriteData: [],
    status: null,
  },
  extraReducers: {
    [addToFavorite.pending]: (state, action) => {
      state.status = 'loading';
      state.addToFavoriteData = action.payload;
    },
    [addToFavorite.fulfilled]: (state, action) => {
      state.status = 'success';
      state.addToFavoriteData = action.payload;
    },
    [addToFavorite.rejected]: (state, action) => {
      state.status = 'failed';
      state.addToFavoriteData = action.payload;
    },
  },
});
export default addToFavoriteSlice.reducer;
