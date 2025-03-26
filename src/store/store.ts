import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore(
  {
    reducer: { [apiSlice.reducerPath]: apiSlice.reducer },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
// enable listener behavior for the store
setupListeners(store.dispatch);

export default store;

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
