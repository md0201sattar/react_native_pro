import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
export const getTrash = createAsyncThunk('getTrash', async data => {
  const userDetails = await getUserDetailsSync();
  var myHeaders = new Headers();

  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  return fetch(
    BASEURl + `webapi/v1/trashlist?limit=${data ?? '1'}`,
    requestOptions,
  )
    .then(response => response.json())
    .then(result => {
      // console.log('trashlist result', result);
      return result;
    })
    .catch(error => {
      console.log('trashlist error', error);
      return error;
    });

  // return await getAPI( BASEURl+`webapi/v1/trashlist?limit=${limit}`, )
  //   .then(async response => {
  //     const {data} = response;
  //     return data;
  //   })
  //   .catch(e => {
  //     if (e.response) {
  //     } else if (e.request) {
  //     } else {
  //     }
  //   });
});

const getTrashSlice = createSlice({
  name: 'getTrash',
  initialState: {
    getTrashData: [],
    status: null,
  },
  extraReducers: {
    [getTrash.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getTrash.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getTrashData = action.payload;
    },
    [getTrash.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getTrashSlice.reducer;
