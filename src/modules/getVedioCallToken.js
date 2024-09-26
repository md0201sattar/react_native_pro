import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI } from "../config/apiMethod";
import BASEURl from '../services/Api'

export const getVedioCallToken = createAsyncThunk(
  "getTodayDipos",
  async (id) => {
    const urlDynamic =
      BASEURl+`webapi/v1/twilio/generate_token.php?userid=${id.userID}&friendid=${id.friend}`
    return await getAPI(urlDynamic)
      .then(async (response) => {
        const { data } = response;
        return data;
      })
      .catch((e) => {
        if (e.response) {
        } else if (e.request) {
        } else {
        }
      });
  }
);

const getVedioCallTokenSlice = createSlice({
  name: "getVedioCallToken",
  initialState: {
    getVedioCallTokenData: {},
    status: null,
  },
  extraReducers: {
    [getVedioCallToken.pending]: (state, action) => {
      state.status = "loading";
    },
    [getVedioCallToken.fulfilled]: (state, action) => {
      state.status = "success";
      state.getTodayDiposData = action.payload;
    },
    [getVedioCallToken.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default getVedioCallTokenSlice.reducer;
