import { useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
    items: [],
    totalAmount: 0,
};

const cartReducer = (state, action) => {
    let existingCartItemIndex;
    let existingCartItem;
    let updatedItems;

    switch (action.type) {
        case 'ADD':
            const newTotalAmount = state.totalAmount + action.item.price * action.item.amount;

            existingCartItemIndex = state.items.findIndex(item => item.id === action.item.id);
            existingCartItem = state.items[existingCartItemIndex];

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    amount: existingCartItem.amount + action.item.amount,
                };
                updatedItems = [...state.items];
                updatedItems[existingCartItemIndex] = updatedItem;
            } else {
                updatedItems = state.items.concat(action.item);
            }

            return {
                ...state,
                items: updatedItems,
                totalAmount: newTotalAmount,
            };
        case 'REMOVE':
            existingCartItemIndex = state.items.findIndex(item => item.id === action.id);
            existingCartItem = state.items[existingCartItemIndex];

            const updatedTotalAmount = state.totalAmount - existingCartItem.price;
            if (existingCartItem.amount === 1) {
                updatedItems = state.items.filter(item => item.id !== action.id);
            } else {
                const updatedItem = {
                    ...existingCartItem,
                    amount: existingCartItem.amount - 1,
                };
                updatedItems = [...state.items];
                updatedItems[existingCartItemIndex] = updatedItem;
            }

            return {
                ...state,
                items: updatedItems,
                totalAmount: updatedTotalAmount,
            };
        case 'CLEAR':
        default:
            return defaultCartState;
    }
};

const CartProvider = props => {
    const [cartState, dispatchCartStateAction] = useReducer(cartReducer, defaultCartState);

    const addItemToCartHandler = item => {
        dispatchCartStateAction({ type: 'ADD', item: item });
    };

    const removeItemToCartHandler = id => {
        dispatchCartStateAction({ type: 'REMOVE', id: id });
    };

    const clearCartHandler = id => {
        dispatchCartStateAction({ type: 'CLEAR' });
    };

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemToCartHandler,
        clearCart: clearCartHandler,
    };

    return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>;
};

export default CartProvider;
