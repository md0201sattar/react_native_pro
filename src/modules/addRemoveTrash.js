import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const addRemoveTrash = createAsyncThunk(
  'addRemoveTrash',
  async formData => {
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

    return fetch(
      BASEURl + `/webapi/v1/trashlist/addremovetrash.php`,
      requestOptions,
    )
      .then(response => response.json())
      .then(response => {
        // console.log('addremovetrash response', response);
        return response;
      })
      .catch(error => {
        console.log('addremovetrash Error', error);
        return error;
      });

    // try {
    //   const response = await uploadImageAPI(
    //     BASEURl + `/webapi/v1/trashlist/addremovetrash.php`,
    //     formData,
    //   )
    //     .then(res => {
    //       return res;
    //     })
    //     .catch(e => {
    //       return e;
    //     });
    //   return response;
    // } catch (error) {
    //   throw error;
    // }
  },
);

const addRemoveTrashSlice = createSlice({
  // name: 'addRemoveTrash',
  // initialState: {
  //   addRemoveTrashData: [],
  //   status: null,
  // },
  // extraReducers: {
  //   [addRemoveTrash.pending]: (state, action) => {
  //     state.status = 'loading';
  //     state.addRemoveTrashData = action.payload;
  //   },
  //   [addRemoveTrash.fulfilled]: (state, action) => {
  //     state.status = 'success';
  //     state.addRemoveTrashData = action.payload;
  //   },
  //   [addRemoveTrash.rejected]: (state, action) => {
  //     state.status = 'failed';
  //     state.addRemoveTrashData = action.payload;
  //   },
  // },
  name: 'addRemoveTrash',
  initialState: {
    addRemoveTrashData: [],
    status: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        action => action.type.endsWith('/pending'),
        (state, action) => {
          state.status = 'loading';
        },
      )
      .addMatcher(
        action => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.status = 'success';
          state.addRemoveTrashData = action.payload;
        },
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.addRemoveTrashData = action.payload;
        },
      );
  },
});

export default addRemoveTrashSlice.reducer;
