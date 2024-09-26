import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';

export const propertyChatList = createAsyncThunk(
  'propertyChatList',
  async authToken => {
    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', authToken);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(BASEURl + 'webapi/v1/chat/chatpropertylisting.php', requestOptions)
      .then(response => {
        // console.log('chatpropertylisting response', response);
        return response;
      })
      .catch(error => {
        console.log('chatpropertylisting Error', error);
        return error;
      });

    // return await uploadImageAPI(
    //   BASEURl + 'webapi/v1/chat/chatpropertylisting.php',
    //   authToken,
    // )
    //   .then(async response => {
    //     console.log('chatpropertylisting response', response);
    //     const {data} = response;
    //     return data;
    //   })
    //   .catch(e => {
    //     console.log('chatpropertylisting Error', e);
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);

const propertyChatListSlice = createSlice({
  name: 'propertyChatList',
  initialState: {
    propertyChatListData: [],
    status: null,
  },
  extraReducers: {
    [propertyChatList.pending]: (state, action) => {
      state.status = 'loading';
    },
    [propertyChatList.fulfilled]: (state, action) => {
      state.status = 'success';
      state.likeDisLikeData = action.payload;
    },
    [propertyChatList.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default propertyChatListSlice.reducer;
