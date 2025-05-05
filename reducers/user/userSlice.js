import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  authentication: false,
  email: "",
  accessToken: "",
  uid: "",
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.authentication = action.payload.authentication
      state.email = action.payload.email
      state.accessToken = action.payload.accessToken
      state.uid = action.payload.uid
    },
    unsetUser: (state ) => {
        state.authentication = false;
        state.email = '';
        state.accessToken = '';
        state.uid = '';
      },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, unsetUser } = userSlice.actions

export const authentication = (state) => state.user.authentication;
export const email = (state) => state.user.email;
export const accessToken = (state) => state.user.accessToken;
export const uid = (state) => state.user.uid;


export default userSlice.reducer