# Redux

## Content

- [Context VS Redux](#context-vs-redux)
- [Setup](#setup)
- [Store](#store)
- [Class Components](#class-components)
- [Action Payload](#action-payload)
- [Redux Toolkit](#redux-toolkit)
- [Multiple States](#multiple-states)
- [REST API](#rest-api)
- [Cart Persistence](#cart-persistence)
- [Action Creator Thunk](#action-creator-thunk)
- [Fetch Cart](#fetch-cart)
- [Redux DevTools](#redux-devtools)
- [Replace Redux With Hooks](#replace-redux-with-hooks)

---

## Context VS Redux

Both context and redux are used to provide a state globally.
Context is easier to manage, but creates, in large projects, 
a lot of nested components used only to provide all the needed states.
Furthermore, context is not performant (yet?) for hight rate changes;
this is because every component subscribed to the state needs to rerender
even if it is interested only to a part of the state.

## Setup

In order to install redux the command is:
```bash
npm i redux react-redux
```
the redux code usually is locatad in a `store` folder.

## Store

The first approach used it the deprecated one, with `createStore`, the new one
with redux toolkit, will be done later.

### Reducer

The store is defined with a reducer function:
```javascript
import { createStore } from 'redux';

const counterInitialState = { counter: 0 };

const counterReducer = (state = counterInitialState, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return {
                ...state,
                counter: state.counter + 1,
            };
        case 'DECREMENT':
            return {
                ...state,
                counter: state.counter - 1,
            };
        default:
            return state;
    }
};

const store = createStore(counterReducer);
```

### Store

The store must be then provided app wide:
```javascript
import { Provider } from 'react-redux';
import store from './store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);
```

### Current State

It is possible to access the current state using `useSelector` or `useStore` 
hooks, the first one is more convinient because allows to access only to 
a slice of the state:
```javascript
const Counter = () => {
    const counterState = useSelector(state => state.counter);

    // ...

    return (
        // ...
        <div className={classes.value}>{counterState}</div>
        // ...
    );
};

export default Counter;
```

### Actions

It is possible to dispatch actions using the `useDispatch` hook:
```javascript
const Counter = () => {
    const counterState = useSelector(state => state.counter);
    const dispatch = useDispatch();

    const incrementHandler = () => {
        dispatch({ type: 'INCREMENT' });
    };

    const decrementHandler = () => {
        dispatch({ type: 'DECREMENT' });
    };

    // ...

    return (
            // ...
            <div>
                <button onClick={decrementHandler}>Decrement</button>
                <button onClick={incrementHandler}>Increment</button>
            </div>
            // ...
    );
};
```

## Class Components

In a class component redux can be integrated in this way:
```javascript
class Counter extends Component {
    incrementHandler() {
        this.props.increment();
    }

    decrementHandler() {
        this.props.decrement();
    }

    toggleCounterHandler() { }

    render() {
        return (
            <main className={classes.counter}>
                <h1>Redux Counter</h1>
                <div className={classes.value}>{this.props.counter}</div>
                <div>
                    <button onClick={this.decrementHandler.bind(this)}>Decrement</button>
                    <button onClick={this.incrementHandler.bind(this)}>Increment</button>
                </div>
                <button onClick={this.toggleCounterHandler}>Toggle Counter</button>
            </main>
        );
    }
}

const mapStateToProps = state => {
    return {
        counter: state.counter,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        increment: () => dispatch({ type: 'INCREMENT' }),
        decrement: () => dispatch({ type: 'DECREMENT' }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

## Action Payload

Is is possible to handle data in the reducer in this way:
```javascript
const counterReducer = (state = counterInitialState, action) => {
    switch (action.type) {
        // ...
        case 'INCREASE':
            return {
                ...state,
                counter: state.counter + action.amount,
            };
        // ...
};
```
and app the new value in the dispatch like this:
```javascript
const Counter = () => {
    // ...

    const increaseByFiveHandler = () => {
        dispatch({ type: 'INCREASE', amount: 5 });
    };

    // ...

    return (
        // ...
        <button onClick={incrementHandler}>Increment</button>
        // ...
    );
};
```

## Redux Toolkit

The redux-toolkit is a library used to simplify the redux management,
can be install with:
```bash
npm i @reduxjs/toolkit
```
the redux library itself can be removed because it is already part of this one.

### Slice

A slice is a logical part of the state, it needs an unique name, an initial state
and a list of reducer functions:
```javascript
const counterInitialState = { counter: 0, showCounter: true };

const counterSlice = createSlice({
    name: 'counter',
    initialState: counterInitialState,
    reducers: {
        increment(state) {
            state.counter++;
        },
        decrement(state) {
            state.counter--;
        },
        increase(state, action) {
            state.counter = state.counter + action.payload; // automatic name
        },
        toggle(state) {
            state.showCounter = !state.showCounter;
        },
    },
});
```
while in the normal redux logic is not a good practice to change the state 
directly, but it is necessary to create a new state every time, in this case
it is possible to directly change the state while a new state is every time
created, and the current one is not accessible directly.

### Store

The store is then defined:
```javascript
const store = configureStore({
    reducer: counterSlice.reducer,
});
```

### Actions

The state slice create automatically unique action starting from the
reducers, therefore it is enugth to export them:
```javascript
export const counterActions = counterSlice.actions;
```
then it is possible to use them in the component:
```javascript
const Counter = () => {
    // ...

    const incrementHandler = () => {
        // dispatch({ type: 'INCREMENT' });
        dispatch(counterActions.increment());
    };

    const increaseByFiveHandler = () => {
        // dispatch({ type: 'INCREASE', amount: 5 });
        dispatch(counterActions.increase(5));
    };

    const decrementHandler = () => {
        // dispatch({ type: 'DECREMENT' });
        dispatch(counterActions.decrement());
    };

    const toggleCounterHandler = () => {
        // dispatch({ type: 'TOGGLE' });
        dispatch(counterActions.toggle());
    };

    // ...
};
```

## Multiple States

It is possible to add a second slice state in this way:
```javascript
// ....

const authInitialState = { isAuthenticated: false };
const authSlice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        login(state) {
            state.isAuthenticated = true;
        },
        logout(state) {
            state.isAuthenticated = false;
        },
    },
});
export const authActions = authSlice.actions;

const store = configureStore({
    // reducer: counterSlice.reducer,
    reducer: {
        counter: counterSlice.reducer,
        auth: authSlice.reducer,
    },
});
```
this new structure of the store reduces changes the way the store is accessed:
```javascript
//...
const counterState = useSelector(state => state.counter.counter);
const showCounterState = useSelector(state => state.counter.showCounter);
//...
```

### Files Division

Each slice should be moved to a separate file:
```javascript
/****************
 * counter.js
 ****************/
import { createSlice } from '@reduxjs/toolkit';

const counterInitialState = { counter: 0, showCounter: true };

const counterSlice = createSlice({
    name: 'counter',
    initialState: counterInitialState,
    reducers: {
        increment(state) {
            state.counter++;
        },
        decrement(state) {
            state.counter--;
        },
        increase(state, action) {
            state.counter = state.counter + action.payload;
        },
        toggle(state) {
            state.showCounter = !state.showCounter;
        },
    },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;

/****************
 * auth.js
 ****************/
import { createSlice } from '@reduxjs/toolkit';

const authInitialState = { isAuthenticated: false };

const authSlice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        login(state) {
            state.isAuthenticated = true;
        },
        logout(state) {
            state.isAuthenticated = false;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

/****************
 * index.js
 ****************/
import { configureStore, createSlice } from '@reduxjs/toolkit';

import counterReducer from './counter';
import authReducer from './auth';

const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: authReducer,
    },
});

export default store;
```
and the related imports must be updated.

## REST API

### Server

In the course is used [firebase](https://firebase.google.com/),
but I prefer something local like
[json-server](https://github.com/typicode/json-server):
```bash
npm install -g json-server

json-server --watch db.json -p 3333
# server listening at http://localhost:3333 
# by default is 3000, but this conflicts with default react
```
the content of `db.json` must be:
```json
{
    "carts": [
        {
            "id": 0,
            "items": [],
            "totalQuantity": 0
        }
    ]
}
```

### Http Client

It can be used external libraries like [axios](https://axios-http.com/docs/intro)
or built in like [fetch](https://it.javascript.info/fetch).\
In the course is used fetch, but i prefer axios, so I will use that one, 
to install:
```bash
npm i axios
```

## Cart Persistence

The simplest way to persist in the server the cart is to subscribe to the
cart state and send an http request on each update:
```javascript
// avoid sending request on startup
let isInitial = true;

function App() {
    const dispatch = useDispatch();

    const cartVisible = useSelector(state => state.ui.cartVisible);
    const notification = useSelector(state => state.ui.notification);
    const cart = useSelector(state => state.cart);

    useEffect(() => {
        if (isInitial) {
            isInitial = false;
            return;
        }

        dispatch(
            uiActions.showNotification({
                status: 'pending',
                title: 'Sending...',
                message: 'Sending cart data.',
            }),
        );
        axios
            .put('http://localhost:3333/carts/0', cart)
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
            // ...
        </>
    );
}
```

## Action Creator Thunk

A better way to send the previous request is to create a function that takes as
input the needed data, in this case the cart, and returns a function that
takes as input the dispatch and manages the async interactions:
```javascript
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
            .put('http://localhost:3333/carts/0', cart)
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
```
in the app component it is enough to dispatch this function and redux will 
automatically execute the return function passing it the dispatch parameter:
```javascript
function App() {
    // ...

    useEffect(() => {
        if (isInitial) {
            isInitial = false;
            return;
        }

        dispatch(sendCartData(cart));

        // the other logic has been moved above

    }, [cart, dispatch]);

    // ...

    return (/* ... */)
}
```

## Fetch Cart

the fetch mechanism can be performed with a thunk in this way:
```javascript
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
```
the state becomes:
```javascript
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
            state.changed = true;
            // ...
        },
        removeItemFromCart(state, action) {
            state.changed = true;
            // ...
        },
    },
});
```
and the app component:
```javascript
function App() {
    // ...

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
    }, [cart, dispatch]);

    return (
        // ...j
    );
}
```

## Redux DevTools

It is possible to add to the browser the
[Redux DevTools](https://github.com/reduxjs/redux-devtools)
in order to see the state, the state history, the action history, 
the diff from the previous state and so on directly on the browser.

The tab is available in the Browser DevTools under Redux.

## Replace Redux With Hooks

### Using React Context

It is possible to obtain the same bahaciour of redux just using the context api.

Context definition
```javascript
const DUMMY_PRODUCTS = [ /* ... */ ];

const ProductsContext = createContext({
    products: [],
    toggleFavorite: productId => { },
});

export const ProductsContextProvider = props => {
    const [productsList, setProductsList] = useState(DUMMY_PRODUCTS);

    const toggleFavorite = productId => {
        setProductsList(currentList => {
            const prodIndex = currentList.findIndex(p => p.id === productId);
            const newFavStatus = !currentList[prodIndex].isFavorite;
            const updatedProducts = [...productsList];
            updatedProducts[prodIndex] = {
                ...currentList[prodIndex],
                isFavorite: newFavStatus,
            };
            return updatedProducts;
        });
    };

    return (
        <ProductsContext.Provider
            value={{ products: productsList, toggleFavorite: toggleFavorite }}>
            {props.children}
        </ProductsContext.Provider>
    );
};

export default ProductsContext;
```
Provide at root level:
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ProductsContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ProductsContextProvider>,
);
```
Retreive the products list:
```javascript
const Products = props => {
    // const productList = useSelector(state => state.shop.products);
    const productList = useContext(ProductsContext).products;

    return (
        <ul className='products-list'>
            {productList.map(prod => ( /* ... */))}
        </ul>
    );
};

const Favorites = props => {
    // const favoriteProducts = useSelector(state =>
    //   state.shop.products.filter(p => p.isFavorite)
    // );
    const favoriteProducts = useContext(ProductsContext).products.filter(p => p.isFavorite);
    // ...
};
```
Update the list status:
```javascript
const ProductItem = props => {
    // const dispatch = useDispatch();
    const { toggleFavorite } = useContext(ProductsContext);

    const toggleFavHandler = () => {
        // dispatch(toggleFav(props.id));
        toggleFavorite(props.id);
    };

    return ( /* ... */);
};
```

The context api is not meant for high frequency updates.
Therefore it works but is not optimized at all, because all components are
notified of a change even if not directly affected by it.

### Using Custom Hooks

It is possible to create an hook that act as redux in this way;
```javascript
let globalState = {};
let listeners = [];
let actions = [];

export const useStore = () => {
    // create a new listener for the component
    const [_, setState] = useState(globalState);

    // define a function that take an actionIdentifier
    const dispatch = (actionIdentifier, payload) => {
        // runs the corrresponding action from the actions lists
        // by passing the current state and an optional payload
        const newState = actions[actionIdentifier](globalState, payload);
        // updates the global state with the updated state of the action
        globalState = { ...globalState, ...newState };
        // notifies all teh listener with the new state
        for (const listener of listeners) {
            listener(globalState);
        }
    };

    useEffect(() => {
        // attach the new component listener to the global listeners list
        listeners.push(setState);

        // removes the componer listener when the componenets unmounts
        return () => {
            listeners = listeners.filter(cur => cur !== setState);
        };
    }, [setState]);

    return [globalState, dispatch];
};

// accept dynamic user configuration
export const initStore = (userActions, initialState) => {
    if (!!initialState) {
        globalState = { ...globalState, ...initialState };
    }
    actions = { ...actions, ...userActions };
};
```
it is possible to configure the store in this way:
```javascript
const initialState = {
    products: [ /* ... */ ],
};

const configureStore = () => {
    const actions = {
        TOGGLE_FAVORITE: (curState, productId) => {
            const prodIndex = curState.products.findIndex(p => p.id === productId);
            const newFavStatus = !curState.products[prodIndex].isFavorite;
            const updatedProducts = [...curState.products];
            updatedProducts[prodIndex] = {
                ...state.products[prodIndex],
                isFavorite: newFavStatus,
            };
            return {
                products: updatedProducts,
            };
        },
    };
    initStore(actions, initialState);
};

export default configureStore;
```
it is possible to configure the store in the `index.js` just in this way:
```javascript
configureProductsStore()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
```
In the end it is possible to use the new hook to get the data:
```javascript
const Products = props => {
    const [{ products: productList }, _] = useStore();

    return (
        <ul className='products-list'>
            {productList.map(prod => (
                // ...
            ))}
        </ul>
    );
};

const Favorites = props => {
    const [{ products: productList }, _] = useStore();
    const favoriteProducts = productList.filter(p => p.isFavorite);

    let content = <p className='placeholder'>Got no favorites yet!</p>;
    if (favoriteProducts.length > 0) {
        content = (
            <ul className='products-list'>
                {favoriteProducts.map(prod => (
                    // ...
                ))}
            </ul>
        );
    }
    return content;
};
```
and dispatch actions:
```javascript
const ProductItem = props => {
    const [_, dispatch] = useStore()

    const toggleFavHandler = () => {
        dispatch("TOGGLE_FAVORITE", props.id)
    };

    return (
        // ...
    );
};
```
In order to do not rerender every time on components that only uses the dispatch
function, it is possible to modify the hook in this way:
```javascript
export const useStore = (shouldListen = true) => {
    // ...
    useEffect(() => {
        // attach only if requested
        if (shouldListen) {
            listeners.push(setState);
        }

        return () => {
            // remove accordantly
            if (shouldListen) {
                listeners = listeners.filter(cur => cur !== setState);
            }
        };
    }, [setState, shouldListen]); // updated dependencies

    // ...
};
```
and in the component, with `React.memo` becomes:
```javascript
const ProductItem = React.memo(props => {
    const [_, dispatch] = useStore(false)

    // ...
});
```

