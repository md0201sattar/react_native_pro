import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
export const getFavoriteProperties = createAsyncThunk(
  'getFavoriteProperties',
  async limit => {
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
      BASEURl + `webapi/v1/favorites/?limit=${limit ?? '1'}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        // console.log('FavoriteProperties result', result);
        return result;
      })
      .catch(error => {
        console.log('FavoriteProperties error', error);
        return error;
      });

    // return await getAPI(
    //   BASEURl+`webapi/v1/favorites/?limit=${limit}`
    // )
    //   .then(async response => {
    //     const {data} = response;
    //     return data;
    //   })
    //   .catch(e => {
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);
const getFavoritePropertiesSlice = createSlice({
  name: 'getFavoriteProperties',
  initialState: {
    getFavoritePropertiesData: [],
    status: null,
  },
  extraReducers: {
    [getFavoriteProperties.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getFavoriteProperties.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getFavoritePropertiesData = action.payload;
    },
    [getFavoriteProperties.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getFavoritePropertiesSlice.reducer;
