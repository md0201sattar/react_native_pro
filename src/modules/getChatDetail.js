import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const getChatDetail = createAsyncThunk(
  'getChatDetail',
  async formData => {
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

    return fetch(BASEURl + `/webapi/v1/chat/chatByproperty.php`, requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('chatByproperty response', response);
        return response;
      })

      .catch(error => {
        console.log('chatByproperty Error', error);
        return error;
      });

    // try {
    //   const response = await uploadImageAPI(
    //     BASEURl+`/webapi/v1/chat/chatByproperty.php`,
    //     formData,

    //   ).then((res) => {
    //     return res;
    //   }).catch((e) => {
    //     return e
    //   })
    //   return response;
    // } catch (error) {
    //   throw error;
    // }
  },
);

const getChatDetailSlice = createSlice({
  name: 'getChatDetail',
  initialState: {
    getChatDetailData: [],
    status: null,
  },
  extraReducers: {
    [getChatDetail.pending]: (state, action) => {
      state.status = 'loading';
      state.getChatDetailData = action.payload;
    },
    [getChatDetail.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getChatDetailData = action.payload;
    },
    [getChatDetail.rejected]: (state, action) => {
      state.status = 'failed';
      state.getChatDetailData = action.payload;
    },
  },
});

export default getChatDetailSlice.reducer;
