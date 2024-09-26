import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI, uploadImageAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export const getPoperties = createAsyncThunk('getPoperties', async type => {
  const userDetails = await getUserDetailsSync();
  var myHeaders = new Headers();
  myHeaders.append('security_key', 'SurfLokal52');
  myHeaders.append('access_token', userDetails?.authToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  var requestOptionsPost = {
    method: 'POST',
    headers: myHeaders,
    body: type.latLng,
    redirect: 'follow',
  };

  var requestOptionsPostWebSearch = {
    method: 'POST',
    headers: myHeaders,
    body: type.data,
    redirect: 'follow',
  };

  return type.type === 0
    ? await fetch(
        BASEURl + 'webapi/v1/property/?limit=' + type?.data?.limit,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          // console.log('property result', result);
          return result;
        })
        .catch(error => {
          console.log('property error', error);
          return error;
        })
    : type.type === 1
    ? fetch(BASEURl + 'webapi/v1/nearby/', requestOptionsPost)
        .then(response => response.json())
        .then(response => {
          // console.log('nearby response', response);
          return response;
        })

        .catch(error => {
          console.log('nearby Error', error);
          return error;
        })
    : type.type === 2
    ? fetch(BASEURl + 'wp-json/search/websearch', requestOptionsPostWebSearch)
        .then(response => response.json())
        .then(response => {
          // console.log('websearch response', response);
          return response;
        })

        .catch(error => {
          console.log('websearch Error', error);
          return error;
        })
    : await fetch(
        BASEURl +
          `webapi/v1/AppFilter?data_custom_taxonomy=${type.data.data_custom_taxonomy}&data_customvalue=${type.data.data_customvalue}&filter_type=${type.data.filter_type}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          // console.log('data_custom_taxonomy result', result);
          return result;
        })
        .catch(error => {
          console.log('data_custom_taxonomy error', error);
          return error;
        });
});

// 1
// await getAPI(BASEURl + 'webapi/v1/property/?limit=' + type?.data?.limit)
// .then(async response => {
//   console.log('response', response);
//   const {data} = response;
//   return data;
// })
// .catch(e => {
//   console.log('e', e);
// })
//1

// await uploadImageAPI(BASEURl + 'webapi/v1/nearby/', type.latLng)
//         .then(async response => {
//           const {data} = response;
//           console.log('type.type === 1 response', response);
//           return data;
//         })
//         .catch(e => {})
//2
// await uploadImageAPI(BASEURl + 'wp-json/search/websearch', type.data)
//         .then(async response => {
//           const {data} = response;
//           return data;
//         })
//         .catch(e => {})
//lsast=>>>
// await getAPI(
//   BASEURl +
//     `webapi/v1/AppFilter?data_custom_taxonomy=${type.data.data_custom_taxonomy}&data_customvalue=${type.data.data_customvalue}&filter_type=${type.data.filter_type}`,
// )
//   .then(async response => {
//     console.log('response', response);
//     const {data} = response;
//     return data;
//   })
//   .catch(e => {
//     console.log('error', e);
//   });
const getPopertiesSlice = createSlice({
  name: 'getPoperties',
  initialState: {
    getPopertiesData: [],
    status: null,
  },
  extraReducers: {
    [getPoperties.pending]: (state, action) => {
      state.satus;
      satus = 'loading';
    },
    [getPoperties.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getPopertiesData = action.payload;
    },
    [getPoperties.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getPopertiesSlice.reducer;
