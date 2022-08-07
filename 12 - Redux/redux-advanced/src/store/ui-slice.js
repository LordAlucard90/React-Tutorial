const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
    cartVisible: false,
    notification: undefined,
};

const slice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggle(state) {
            state.cartVisible = !state.cartVisible;
        },
        showNotification(state, action) {
            state.notification = {
                status: action.payload.status,
                title: action.payload.title,
                message: action.payload.message,
            };
        },
    },
});

export const uiActions = slice.actions;

export default slice.reducer;
