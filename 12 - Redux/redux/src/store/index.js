import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createStore } from 'redux';

import counterReducer from './counter';
import authReducer from './auth';

// const counterInitialState = { counter: 0, showCounter: true };
// const counterSlice = createSlice({
//     name: 'counter',
//     initialState: counterInitialState,
//     reducers: {
//         increment(state) {
//             state.counter++;
//         },
//         decrement(state) {
//             state.counter--;
//         },
//         increase(state, action) {
//             state.counter = state.counter + action.payload;
//         },
//         toggle(state) {
//             state.showCounter = !state.showCounter;
//         },
//     },
// });
// export const counterActions = counterSlice.actions;

// const authInitialState = { isAuthenticated: false };
// const authSlice = createSlice({
//     name: 'auth',
//     initialState: authInitialState,
//     reducers: {
//         login(state) {
//             state.isAuthenticated = true;
//         },
//         logout(state) {
//             state.isAuthenticated = false;
//         },
//     },
// });
// export const authActions = authSlice.actions;

const store = configureStore({
    // reducer: counterSlice.reducer,
    reducer: {
        // counter: counterSlice.reducer,
        // auth: authSlice.reducer,
        counter: counterReducer,
        auth: authReducer,
    },
});

// const counterReducer = (state = counterInitialState, action) => {
//     switch (action.type) {
//         case 'INCREMENT':
//             return {
//                 ...state,
//                 counter: state.counter + 1,
//             };
//         case 'INCREASE':
//             return {
//                 ...state,
//                 counter: state.counter + action.amount,
//             };
//         case 'DECREMENT':
//             return {
//                 ...state,
//                 counter: state.counter - 1,
//             };
//         case 'TOGGLE':
//             return {
//                 ...state,
//                 showCounter: !state.showCounter,
//             };
//         default:
//             return state;
//     }
// };
//
// const store = createStore(counterReducer);

export default store;
