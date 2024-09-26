import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const chat = createAsyncThunk('chat', async payload => {
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

  return fetch(BASEURl + 'wp-json/chatbot/chatgpt', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('chatgpt response', response);
      return response;
    })

    .catch(error => {
      console.log('chatgpt Error', error);
      return error;
    });

  // return await uploadImageAPI(
  //   BASEURl + 'wp-json/chatbot/chatgpt',
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

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatData: [],
    status: null,
  },
  extraReducers: {
    [chat.pending]: (state, action) => {
      state.status = 'loading';
    },
    [chat.fulfilled]: (state, action) => {
      state.status = 'success';
      state.chatData = action.payload;
    },
    [chat.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default chatSlice.reducer;
