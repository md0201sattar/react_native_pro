import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
export const getNotifications = createAsyncThunk(
  'getNotifications',
  async data => {
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
      BASEURl + `webapi/v1/notifications?limit=${data}`,
      requestOptions,
    )
      .then(response => {
        // console.log(
        //   'Notification API => Server Response Status:',
        //   response.status,
        // );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(result => {
        // console.log('notifications result =>', result);
        if (result?.code !== 200) {
          throw new Error(`HTTP error! Status: ${result.status}`);
        } else {
          return result;
        }
      })
      .catch(error => {
        // console.log('notifications error', error);
        // return error;
        return 'Notifications API Failed';
      });

    // return await getAPI( BASEURl + `webapi/v1/notifications?limit=${limit}`)
    //   .then(async response => {
    //     const { data } = response;
    //     return data;
    //   })
    //   .catch(e => {
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);

const getNotificationsSlice = createSlice({
  name: 'getNotifications',
  initialState: {
    getNotificationsData: [],
    status: null,
  },
  // extraReducers: {
  //   [getNotifications.pending]: (state, action) => {
  //     state.status = 'loading';
  //   },
  //   [getNotifications.fulfilled]: (state, action) => {
  //     state.status = 'success';
  //     if (action.payload) {
  //       state.getNotificationsData = action.payload;
  //     }
  //   },

  //   [getNotifications.rejected]: (state, action) => {
  //     state.status = 'failed';
  //   },
  // },

  extraReducers: builder => {
    builder
      .addCase(getNotifications.pending, state => {
        state.status = 'loading';
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.status = 'success';
        if (action.payload) {
          state.getNotificationsData = action.payload;
        }
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; // Store only the error message
      });
  },
});

export default getNotificationsSlice.reducer;
