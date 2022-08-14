import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import productReducer from './store/reducers/products';
import { ProductsContextProvider } from './context/products-context';
import configureProductsStore from './hooks-store/products-store';

const root = ReactDOM.createRoot(document.getElementById('root'));

// const rootReducer = combineReducers({
//     shop: productReducer,
// });
// const store = createStore(rootReducer);
// root.render(
//     <Provider store={store}>
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     </Provider>,
// );

// root.render(
//     <ProductsContextProvider>
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     </ProductsContextProvider>,
// );

configureProductsStore();

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
