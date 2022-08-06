import Header from './components/Layout/Header';
import Meals from './components/Meals/Meals';
import Cart from './components/Cart/Cart';
import CartProvider from './store/CartProvider';
import { useState } from 'react';

const App = () => {
    const [isCartVisible, setIsCartVisible] = useState(false);

    const showCartHandler = () => {
        setIsCartVisible(true);
    };

    const hideCartHandler = () => {
        setIsCartVisible(false);
    };

    return (
        <CartProvider>
            {isCartVisible && <Cart onClose={hideCartHandler} />}
            <Header onShowCart={showCartHandler} />
            <Meals />
        </CartProvider>
    );
};

export default App;
