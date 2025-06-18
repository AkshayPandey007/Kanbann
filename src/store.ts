import { configureStore } from '@reduxjs/toolkit';
// import your reducers here
import boardReducer from './redux/Feature/boardSlice';
import taskReducer from './redux/Feature/taskSlice';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    tasks: taskReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
