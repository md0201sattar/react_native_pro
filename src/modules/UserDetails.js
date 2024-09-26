import {createSlice} from '@reduxjs/toolkit';

const UserDetailsSlice = createSlice({
  name: 'UserDetails',
  initialState: {
    UserDetailsData: null,
    status: null,
  },
  reducers: {
    setUserDetails: (state, action) => {
      console.log('action.payload', action.payload);
      state.status = 'success';
      state.UserDetailsData = action.payload;
    },
  },
});

export const {setUserDetails} = UserDetailsSlice.actions;
export default UserDetailsSlice.reducer;
