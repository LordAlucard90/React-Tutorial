import styles from './Cart.module.css';

import Modal from '../UI/Modal';
import { useContext, useState } from 'react';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import Checkout from './Checkout';
import axios from 'axios';

const Cart = props => {
    // const items = [{ id: 'c1', name: 'First', amount: 2, price: 9.99 }];
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const cartContext = useContext(CartContext);

    const totalAmount = `${cartContext.totalAmount.toFixed(2)} €`;
    const hasItems = cartContext.items.length > 0;

    const cartItemRemoveHandler = id => {
        cartContext.removeItem(id);
    };

    const cartItemAddHandler = item => {
        cartContext.addItem({ ...item, amount: 1 });
    };

    const orderHandler = () => {
        setIsCheckout(true);
    };

    const cartItems = (
        <ul className={styles['cart-items']}>
            {cartContext.items.map(cur => {
                return (
                    <CartItem
                        key={cur.id}
                        name={cur.name}
                        amount={cur.amount}
                        price={cur.price}
                        onRemove={cartItemRemoveHandler.bind(null, cur.id)}
                        onAdd={cartItemAddHandler.bind(null, cur)}
                    />
                );
            })}
        </ul>
    );

    const modalActions = (
        <div className={styles.actions}>
            <button className={styles['button--alt']} onClick={props.onClose}>
                Close
            </button>
            {hasItems && (
                <button className={styles.button} onClick={orderHandler}>
                    Order
                </button>
            )}
        </div>
    );

    const submitOrderHandler = userData => {
        setIsSubmitting(true);
        setDidSubmit(false);
        axios
            .post('http://localhost:3333/orders', {
                user: userData,
                oderItems: cartContext.items,
            })
            .then(() => {
                setDidSubmit(true);
                cartContext.clearCart();
            })
        // TODO manage error...
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const cartModalContent = (
        <>
            {cartItems}
            <div className={styles.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
            {!isCheckout && modalActions}
        </>
    );

    const isSubmittingModalContent = <p>Sending Order Data...</p>;

    const didSubmitModalContent = (
        <>
            <p>Correctly sent the order!</p>
            <div className={styles.actions}>
                <button className={styles.button} onClick={props.onClose}>
                    Close
                </button>
            </div>
        </>
    );

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    );
};

export default Cart;
