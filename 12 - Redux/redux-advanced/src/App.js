import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { sendCartData, fetchCartData } from './store/cart-actions';
import { uiActions } from './store/ui-slice';

let isInitial = true;

function App() {
    const dispatch = useDispatch();

    const cartVisible = useSelector(state => state.ui.cartVisible);
    const notification = useSelector(state => state.ui.notification);
    const cart = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCartData());
    }, [dispatch]);

    useEffect(() => {
        if (isInitial) {
            isInitial = false;
            return;
        }

        if (cart.changed) {
            dispatch(sendCartData(cart));
        }

        // dispatch(
        //     uiActions.showNotification({
        //         status: 'pending',
        //         title: 'Sending...',
        //         message: 'Sending cart data.',
        //     }),
        // );
        // axios
        //     .put('http://localhost:3333/carts/0', cart)
        //     .then(response => {
        //         dispatch(
        //             uiActions.showNotification({
        //                 status: 'success',
        //                 title: 'Success!',
        //                 message: 'Sent cart data successfully.',
        //             }),
        //         );
        //     })
        //     .catch(err => {
        //         dispatch(
        //             uiActions.showNotification({
        //                 status: 'error',
        //                 title: 'Error!',
        //                 message: err.message,
        //             }),
        //         );
        //     });
    }, [cart, dispatch]);

    return (
        <>
            {!!notification && (
                <Notification
                    status={notification.status}
                    title={notification.title}
                    message={notification.message}
                />
            )}
            <Layout>
                {cartVisible && <Cart />}
                <Products />
            </Layout>
        </>
    );
}

export default App;
