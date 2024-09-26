import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const getAgent = createAsyncThunk('getAgent', async authToken => {
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
  return fetch(BASEURl + 'webapi/v1/agent/', requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log('agent result', result);
      return result;
    })
    .catch(error => {
      console.log('agent error', error);
      return error;
    });

  // return await getAPI(
  //   BASEURl + 'webapi/v1/agent/',
  //   (header = {
  //     security_key: 'SurfLokal52',
  //     access_token: authToken,
  //   }),
  // )
  //   .then(async response => {
  //     const {data} = response;
  //     console.log('agent', data);
  //     return data;
  //   })
  //   .catch(e => {
  //     if (e.response) {
  //     } else if (e.request) {
  //     } else {
  //     }
  //   });
});

const getAgentSlice = createSlice({
  name: 'getAgent',
  initialState: {
    getAgentData: [],
    status: null,
  },
  extraReducers: {
    [getAgent.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getAgent.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getAgentData = action.payload;
    },
    [getAgent.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getAgentSlice.reducer;
