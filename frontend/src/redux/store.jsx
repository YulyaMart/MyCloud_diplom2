import { configureStore } from '@reduxjs/toolkit';
import filesReducers from './filesReducers'; 
import userReducers from './usersReducers';

const store = configureStore({
  reducer: {
    files: filesReducers,
    user: userReducers,
  },
});

export default store;
