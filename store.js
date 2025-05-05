import { configureStore } from '@reduxjs/toolkit'

//USER REDUCERS
import userReducer from './reducers/user/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})