import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const getRewardListing = createAsyncThunk(
  'getRewardListings',
  async () => {
    const urlDynamic = BASEURl + 'webapi/v1/rewards/reward_listing.php ';
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
    return fetch(urlDynamic, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('reward_listing result', result);
        return result;
      })
      .catch(error => {
        console.log('reward_listing error', error);
        return error;
      });

    // return await getAPI(urlDynamic)
    //   .then(async (response) => {
    //     const { data } = response;
    //     return data;
    //   })
    //   .catch((e) => {
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);

const getRewardListingSlice = createSlice({
  name: 'getRewardListing',
  initialState: {
    getRewardListing: [],
    status: null,
  },
  extraReducers: {
    [getRewardListing.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getRewardListing.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getRewardListing = action.payload;
    },
    [getRewardListing.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getRewardListingSlice.reducer;
