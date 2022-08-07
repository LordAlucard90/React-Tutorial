import axios from 'axios';
import { uiActions } from './ui-slice';

const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
    items: [],
    totalQuantity: 0,
    changed: false,
};

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        replaceCart(state, action) {
            state.items = action.payload.items;
            state.totalQuantity = action.payload.totalQuantity;
        },
        addItemToCart(state, action) {
            state.totalQuantity++;
            state.changed = true;
            const item = action.payload;
            const existing = state.items.find(cur => cur.id === item.id);
            if (!existing) {
                state.items.push({
                    ...item,
                    quantity: 1,
                    totalPrice: item.price,
                });
            } else {
                existing.quantity++;
                existing.totalPrice = existing.totalPrice + item.price;
            }
        },
        removeItemFromCart(state, action) {
            state.totalQuantity--;
            state.changed = true;
            const existing = state.items.find(cur => cur.id === action.payload);
            if (existing.quantity === 1) {
                state.items = state.items.filter(cur => cur.id !== action.payload);
            } else {
                existing.quantity--;
                existing.totalPrice = existing.totalPrice - existing.price;
            }
        },
    },
});

export const cartActions = slice.actions;

export default slice.reducer;
