import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
export const pushNotificaton = createAsyncThunk(
  'pushNotificaton',
  async data => {
    //
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
      BASEURl +
        `webapi/v1/push_notification/push.php?propid=${data.propid}&schedule_hour= ${data.schedule_hour} &schedule_day=${data.schedule_day}&user_mobile= ${data.user_mobile}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log('push_notification result', result);
        return result;
      })
      .catch(error => {
        console.log('push_notification error', error);
        return error;
      });

    // return await getAPI (
    //   BASEURl+`webapi/v1/push_notification/push.php?propid=${data.propid}&schedule_hour= ${data.schedule_hour} &schedule_day=${data.schedule_day}&user_mobile= ${data.user_mobile}`
    // )
    //   .then(async response => {
    //     const {data} = response;
    //      return data;
    //   })
    //   .catch(e => {
    //     if (e.response) {
    //     } else if (e.request) {
    //     } else {
    //     }
    //   });
  },
);

const pushNotificatonSlice = createSlice({
  name: 'pushNotificaton',
  initialState: {
    pushNotificatonData: [],
    status: null,
  },
  extraReducers: {
    [pushNotificaton.pending]: (state, action) => {
      state.status = 'loading';
    },
    [pushNotificaton.fulfilled]: (state, action) => {
      state.status = 'success';
      state.pushNotificatonData = action.payload;
    },
    [pushNotificaton.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default pushNotificatonSlice.reducer;
