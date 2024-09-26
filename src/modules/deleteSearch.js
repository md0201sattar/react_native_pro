import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const deleteSearch = createAsyncThunk('deleteSearch', async formData => {
  //
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

  return fetch(
    BASEURl + `webapi/v1/search/delete_searchlist.php`,
    requestOptions,
  )
    .then(response => response.json())
    .then(response => {
      console.log('delete_searchlist response', response);
      return response;
    })

    .catch(error => {
      console.log('delete_searchlist Error', error);
      return error;
    });

  // try {
  //   const response = await uploadImageAPI(
  //     BASEURl + `webapi/v1/search/delete_searchlist.php`,
  //     formData,
  //   ).then((res) => {
  //     return res;
  //   }).catch((e) => {
  //     return e
  //   })
  //   return response;
  // } catch (error) {
  //   throw error;
  // }
});

const deleteSearchSlice = createSlice({
  name: 'deleteSearch',
  initialState: {
    deleteSearchData: [],
    status: null,
  },
  extraReducers: {
    [deleteSearch.pending]: (state, action) => {
      state.status = 'loading';
    },
    [deleteSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.deleteSearchData = action.payload;
    },
    [deleteSearch.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});
export default deleteSearchSlice.reducer;
