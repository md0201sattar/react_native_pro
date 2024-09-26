import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';

export const getUserScore = createAsyncThunk(
  'getUserScore',
  async authToken => {
    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', authToken);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    return fetch(
      BASEURl + 'webapi/v1/rewards/user_leaderboard.php',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        // console.log('user_leaderboard result', result);
        return result;
      })
      .catch(error => {
        console.log('user_leaderboard error', error);
        return error;
      });

    // return await getAPI( BASEURl + 'webapi/v1/rewards/user_leaderboard.php',)
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
  },
);

const getUserScoreSlice = createSlice({
  name: 'getUserScore',
  initialState: {
    getUserScoreData: [],
    status: null,
  },
  extraReducers: {
    [getUserScore.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getUserScore.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getUserScoreData = action.payload;
    },
    [getUserScore.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getUserScoreSlice.reducer;
