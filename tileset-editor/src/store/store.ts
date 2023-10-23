import {configureStore} from "@reduxjs/toolkit";
import rootReducer from './root';

export const store = configureStore({
    reducer: {
        root: rootReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
