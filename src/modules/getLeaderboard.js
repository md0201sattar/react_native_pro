import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
export const getLeaderboard = createAsyncThunk('getLeaderboard', async () => {
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
  return fetch(BASEURl + 'webapi/v1/rewards/leaderboard.php', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('leaderboard result', result);
      return result;
    })
    .catch(error => {
      console.log('leaderboard error', error);
      return error;
    });

  // return await getAPI( BASEURl + 'webapi/v1/rewards/leaderboard.php')
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

const getLeaderboardSlice = createSlice({
  name: 'getLeaderboard',
  initialState: {
    getLeaderboardData: [],
    status: null,
  },
  extraReducers: {
    [getLeaderboard.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getLeaderboard.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getLeaderboardData = action.payload;
    },
    [getLeaderboard.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getLeaderboardSlice.reducer;
