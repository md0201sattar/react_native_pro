import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';

export const googleUser = createAsyncThunk('googleUser', async dispatch => {
  return await postAPI(
    BASEURl+'webapi/v1/login/emaillogin.php',

    dispatch,
  )
    .then(async response => {
      const {data} = response;
      if (data.success) {
        const ids = data.data[0].userID;
        await AsyncStorage.setItem('userId', ids + '');
        await AsyncStorage.setItem('userDetails', JSON.stringify(data.data));

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
    });
});

const googleUserSlice = createSlice({
  name: 'google',
  initialState: {
    loginData: [],
    status: null,
  },
  extraReducers: {
    [googleUser.pending]: (state, action) => {
      state.status = 'loading';
    },
    [googleUser.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
    },
    [googleUser.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default googleUserSlice.reducer;
