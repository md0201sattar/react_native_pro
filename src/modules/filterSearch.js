import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const filterSearch = createAsyncThunk('filterSearch', async formData => {
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

  return fetch(BASEURl + `wp-json/search/FilterSearch`, requestOptions)
    .then(response => response.json())
    .then(response => {
      // console.log('FilterSearch response', response);
      return response;
    })

    .catch(error => {
      console.log('FilterSearch Error', error);
      return error;
    });

  // try {
  //   const response = await uploadImageAPI(
  //     BASEURl + `wp-json/search/FilterSearch`,
  //     formData,
  //   )
  //     .then(res => {
  //       console.log('FilterSearch res', res);
  //       return res;
  //     })
  //     .catch(e => {
  //       console.log('FilterSearch Error', e);
  //       return e;
  //     });

  //   return response;
  // } catch (error) {
  //   throw error;
  // }
});

const filterSearchSlice = createSlice({
  name: 'filterSearch',
  initialState: {
    filterSearchData: [],
    status: null,
  },
  extraReducers: {
    [filterSearch.pending]: (state, action) => {
      state.status = 'loading';
      state.filterSearchData = action.payload;
    },
    [filterSearch.fulfilled]: (state, action) => {
      state.status = 'success';
      state.filterSearchData = action.payload;
    },
    [filterSearch.rejected]: (state, action) => {
      state.status = 'failed';
      state.filterSearchData = action.payload;
    },
  },
});

export default filterSearchSlice.reducer;
