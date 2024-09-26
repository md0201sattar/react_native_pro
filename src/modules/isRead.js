import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BASEURl from '../services/Api';
import {uploadImageAPI} from '../config/apiMethod';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const isRead = createAsyncThunk('isRead', async dispatch => {
  const formData = new FormData();
  formData.append('chatId', dispatch.ID);

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

  return fetch(BASEURl + `/webapi/v1/chat/Isread.php`, requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('chat/Isread response', response);
      return response;
    })

    .catch(error => {
      console.log('chat/Isread Error', error);
      return error;
    });

  //  try {
  //         const response = await uploadImageAPI(
  //           BASEURl+`/webapi/v1/chat/Isread.php`,
  //           formData,

  //         ).then((res) => {
  //           return res;
  //         }).catch((e) => {
  //           return e
  //         })

  //         return response;
  //       } catch (error) {
  //         throw error;
  // }
});

const isReadSlice = createSlice({
  name: 'isRead',
  initialState: {
    isReadData: [],
    status: null,
  },
  extraReducers: {
    [isRead.pending]: (state, action) => {
      state.status = 'loading';
    },
    [isRead.fulfilled]: (state, action) => {
      state.status = 'success';
      state.isReadData = action.payload;
    },
    [isRead.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default isReadSlice.reducer;
