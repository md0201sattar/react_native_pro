import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const schoolChat = createAsyncThunk('schoolChat', async payload => {
  //
  const userDetails = await getUserDetailsSync();
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: payload,
    redirect: 'follow',
  };

  return fetch(BASEURl + 'wp-json/chatbot/SchoolChatBot', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('SchoolChatBot response', response);
      return response;
    })

    .catch(error => {
      console.log('SchoolChatBot Error', error);
      return error;
    });

  // return await uploadImageAPI(
  //   BASEURl+'wp-json/chatbot/SchoolChatBot',
  //   payload,
  // )
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

const schoolChatSlice = createSlice({
  name: 'schoolChat',
  initialState: {
    schoolChatData: [],
    status: null,
  },
  extraReducers: {
    [schoolChat.pending]: (state, action) => {
      state.status = 'loading';
    },
    [schoolChat.fulfilled]: (state, action) => {
      state.status = 'success';
      state.schoolChatData = action.payload;
    },
    [schoolChat.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default schoolChatSlice.reducer;
