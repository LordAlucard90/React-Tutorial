import axios from 'axios';
import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

export const fetchCartData = () => {
    return dispatch => {
        axios
            .get('http://localhost:3333/carts/0')
            .then(response => {
                // console.log(response);
                const cart = response.data;
                dispatch(
                    cartActions.replaceCart({
                        items: cart.items || [],
                        totalQuantity: cart.totalQuantity || 0,
                    }),
                );
            })
            .catch(err => {
                dispatch(
                    uiActions.showNotification({
                        status: 'error',
                        title: 'Error!',
                        message: err.message,
                    }),
                );
            });
    };
};

export const sendCartData = cart => {
    return dispatch => {
        dispatch(
            uiActions.showNotification({
                status: 'pending',
                title: 'Sending...',
                message: 'Sending cart data.',
            }),
        );
        axios
            .put('http://localhost:3333/carts/0', {
                items: cart.items,
                totalQuantity: cart.totalQuantity,
            })
            .then(response => {
                dispatch(
                    uiActions.showNotification({
                        status: 'success',
                        title: 'Success!',
                        message: 'Sent cart data successfully.',
                    }),
                );
            })
            .catch(err => {
                dispatch(
                    uiActions.showNotification({
                        status: 'error',
                        title: 'Error!',
                        message: err.message,
                    }),
                );
            });
    };
};
