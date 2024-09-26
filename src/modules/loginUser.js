import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import AsyncStorage from '@react-native-community/async-storage';

const Header = {
  security_key: 'SurfLokal52',
};
export const loginUser = createAsyncThunk('loginUser', async dispatch => {
  return await uploadImageAPI(
    BASEURl + 'wp-json/custom-plugin/login/',
    dispatch,
    Header,
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
      console.log('login Error :', e);
      if (e.response) {
      } else if (e.request) {
      } else {
      }
      return e;
    });
});

const loginUserSlice = createSlice({
  // name: 'login',
  // initialState: {
  //   loginData: {},
  //   status: null,
  //   isLoading: false,
  // },
  // extraReducers: {
  //   [loginUser.pending]: (state, action) => {
  //     state.status = 'loading';
  //     state.isLoading = true;
  //   },
  //   [loginUser.fulfilled]: (state, action) => {
  //     state.status = 'success';
  //     state.loginData = action.payload;
  //     state.isLoading = false;
  //   },
  //   [loginUser.rejected]: (state, action) => {
  //     state.status = 'failed';
  //     state.isLoading = false;
  //   },
  // },
  name: 'login',
  initialState: {
    loginData: {},
    status: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.loginData = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, state => {
        state.status = 'failed';
        state.isLoading = false;
      });
  },
});

export default loginUserSlice.reducer;
