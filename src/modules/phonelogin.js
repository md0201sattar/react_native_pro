import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import AsyncStorage from '@react-native-community/async-storage';

export const loginPhoneUser = createAsyncThunk(
  'loginPhoneUser',
  async dispatch => {
    return await uploadImageAPI(
      BASEURl + 'webapi/v1/login/send_otp.php',
      dispatch,
    )
      .then(async response => {
        const {data} = response;

        if (data.success) {
          const ids = data?.data?.ID;
          const user_details = data?.data;
          const profile_img = data?.metadata?.custom_picture;

          if (ids) {
            await AsyncStorage.setItem('userId', JSON.stringify(ids));
          } else {
            await AsyncStorage.setItem('userId', null);
          }
          if (user_details) {
            await AsyncStorage.setItem(
              'userDetails',
              JSON.stringify(user_details),
            );
          } else {
            await AsyncStorage.setItem('userDetails', null);
          }

          // if (profile_img) {
          //   await AsyncStorage.setItem('imageUri', JSON.stringify(profile_img));
          // } else {
          //   await AsyncStorage.setItem('imageUri', null);
          // }

          return data;
        } else {
          return data;
        }
      })
      .catch(e => {
        if (e.response) {
        } else if (e.request) {
        } else {
        }
        return e;
      });
  },
);

const loginPhoneUserSlice = createSlice({
  // name: 'loginPhone',
  // initialState: {
  //   loginPhoneUserData: {},
  //   status: null,
  // },
  // extraReducers: {
  //   [loginPhoneUser.pending]: (state, action) => {
  //     state.status = 'loading';
  //   },
  //   [loginPhoneUser.fulfilled]: (state, action) => {
  //     state.status = 'success';
  //     state.loginData = action.payload;
  //   },
  //   [loginPhoneUser.rejected]: (state, action) => {
  //     state.status = 'failed';
  //   },
  // },
  name: 'loginPhone',
  initialState: {
    loginPhoneUserData: {},
    status: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginPhoneUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(loginPhoneUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.loginPhoneUserData = action.payload;
      })
      .addCase(loginPhoneUser.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default loginPhoneUserSlice.reducer;
