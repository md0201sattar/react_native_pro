import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import axios from 'axios';

export const verifyOTP = createAsyncThunk(
  'verifyOTP',
  async ({formdata, authToken}) => {
    // console.log('authToken =>', authToken);
    // console.log('formdata =>', formdata);

    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', authToken);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    return fetch(
      'https://www.surflokal.com/webapi/v1/login/verify_otp.php',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        // console.log('result', result);
        return result;
      })
      .catch(error => {
        // console.log('error', error);
        return error;
      });

    // return await uploadImageAPI(
    //   BASEURl + 'webapi/v1/login/verify_otp.php',
    //   dispatch,
    //   authToken,
    // )
    //   .then(async response => {
    //     const {data} = response;
    //     console.log('OTP response', data);
    //     if (data.status) {
    //       return data;
    //     } else {
    //       return data;
    //     }
    //   })
    //   .catch(e => {
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);

const verifyOTPSlice = createSlice({
  name: 'verifyOTP',
  initialState: {
    verifyOTPData: {},
    status: null,
  },
  extraReducers: {
    [verifyOTP.pending]: (state, action) => {
      state.status = 'loading';
    },
    [verifyOTP.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
    },
    [verifyOTP.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default verifyOTPSlice.reducer;
