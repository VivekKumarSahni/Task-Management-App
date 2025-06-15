import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice'
import taskReducer from '../task/taskSlice'


export const store = configureStore({
  reducer: {
   
    auth:authReducer,
    task:taskReducer,
    

  },

});
