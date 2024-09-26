import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BASEURl from '../services/Api';
import {uploadImageAPI} from '../config/apiMethod';

export const logOut = createAsyncThunk('logOut', async authToken => {
  // try {
  //   console.log('  URl ', BASEURl + `wp-json/custom-plugin/logout/`);
  //   const response = await uploadImageAPI(
  //     BASEURl + `wp-json/custom-plugin/logout/`,
  //   )
  //     .then(res => {
  //       console.log('Log Out Api Res : ', res?.data);
  //       return res;
  //     })
  //     .catch(e => {
  //       console.log('Log Out Api Error : ', res);
  //       return e;
  //     });
  //   return response;
  // } catch (error) {
  //   throw error;
  // }
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', authToken);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  };
  return fetch(BASEURl + 'wp-json/custom-plugin/logout/', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('Log Out Api Res :', result);
      return result;
    })
    .catch(error => {
      console.log('Log Out Api Error :', error);
      return error;
    });
});

const logOutSlice = createSlice({
  name: 'logOut',
  initialState: {
    logOutData: [],
    status: null,
  },
  extraReducers: {
    [logOut.pending]: (state, action) => {
      state.status = 'loading';
      state.logOutData = action.payload;
    },
    [logOut.fulfilled]: (state, action) => {
      state.status = 'success';
      state.logOutData = action.payload;
    },
    [logOut.rejected]: (state, action) => {
      state.status = 'failed';
      state.logOutData = action.payload;
    },
  },
});

export default logOutSlice.reducer;
