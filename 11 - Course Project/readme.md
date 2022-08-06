# Course Project

## Content

Course project:
- [CSS Modules](#css-modules)
Food order app:
- [Local Images](#local-images)
- [Object Props Forwarding](#object-props-forwarding)
- [Modals](#modals)
- [Context](#context)
- [REST API](#rest-api)
- [Get Request](#get-request)
- [Form Validation](#form-validation)
- [Submit Order](#submit-order)

---

## CSS Modules

In order to use the style of css modules for nested custom components,
it is necessary to forward them using props:
```javascript
import styles from './AddUser.module.css';

const AssUser = () => {
    // ...

    return (
        <Card className={styles.input}>
            // ...
        </Card>
    );
};
```
```javascript
import styles from './Card.module.css';

const Card = props => {
    return <div className={`${styles.card} ${props.className}`}>{props.children}</div>;
};
```

## Local Images

It is possible to import local images inside the project by importing them as 
a package (but with extension) and then add it in the `src` property:
```javascript
import mealsImage from '../../assets/meals.jpg';

const Header = () => {
    return (
        // ...
            <img src={mealsImage} />
        // ...
    );
};
```

## Object Props Forwarding

In order to do not explicitly set all the properties that must be forwarded
to a nested component, it is possible to use the spread operator in 
conjunction with an Object:
```javascript
const Input = props => {
    return (
        <div className={styles.input}>
            <label htmlFor={props.input.id}>{props.label}</label>
            <input {...props.input} />
        </div>
    );
};

const MealItemForm = props => {
    return (
        <form className={styles.form}>
            <Input
                label='Amount'
                input={{
                    id: 'amount_' + props.id, // used to ensure unicity
                    type: 'number',
                    min: '1',
                    max: '5',
                    step: '1',
                    defaultValue: '1',
                }}
            />
            <button>+ Add</button>
        </form>
    );
};
```

## Modals

To correctly create modals it is necessary to:

Add a new element in the `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <!-- new selector -->
    <div id="overlays"></div>
    <div id="root"></div>
    <!-- ... -->
  </body>
</html>
```
Use ReactDOM to move the html management in that place:
```javascript
const Backdrop = props => {
    return <div className={styles.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = props => {
    return (
        <div className={styles.modal}>
            <div className={styles.content}>{props.children}</div>
        </div>
    );
};

const Modal = props => {
    const portalElement = document.getElementById('overlays');

    return (
        <>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
            {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
        </>
    );
};
```

## Context

The cart context can be added in this way:
```javascript
const CartContext = createContext({
    items: [],
    totalAmount: 0,
    addItem: item => {},
    removeItem: id => {},
});
```
then it is possible to add a provider component
```javascript
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
        default:
            return state;
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

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemToCartHandler,
    };

    return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>;
};
```
and use it at the root level:
```javascript
const App = () => {
    // ...

    return (
        // <>
        <CartProvider>
            // ...
        </CartProvider>
        // </>
    );
};
```
the cart become:
```javascript
const HeaderCartButton = props => {
    const [buttonIsAnimated, setButtonIsAnimated] = useState(false);
    const cartContext = useContext(CartContext);

    const cartItemsNumber = cartContext.items.reduce((curValue, item) => {
        return curValue + item.amount;
    }, 0);

    const buttonClasses = `${styles.button} ${buttonIsAnimated ? styles.bump : ''}`;

    useEffect(() => {
        if (cartContext.items.length === 0) {
            return;
        }

        setButtonIsAnimated(true);

        const timer = setTimeout(() => {
            setButtonIsAnimated(false);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [cartContext.items]);

    return (
        <button className={buttonClasses} onClick={props.onClick}>
            <span className={styles.icon}>
                <CartIcon />
            </span>
            <span>Cart</span>
            <span className={styles.badge}>{cartItemsNumber}</span>
        </button>
    );
};

const MealItemForm = props => {
    const [amountIsValid, setAmountIsValid] = useState(true);
    const amountRef = useRef();
    const submitHandler = event => {
        event.preventDefault();
        const enteredAmount = amountRef.current.value;
        const enteredAmountNumber = +enteredAmount;

        if ( enteredAmount.trim().length === 0 || enteredAmountNumber < 1 || enteredAmountNumber > 5) {
            setAmountIsValid(false);
            return;
        }
        setAmountIsValid(true);
        props.onAddToCart(enteredAmountNumber);
    };

    return (
        <form className={styles.form} onSubmit={submitHandler}>
            <Input
                ref={amountRef}
                label='Amount'
                input={{ id: 'amount_' + props.id, type: 'number', min: '1', max: '5', step: '1', defaultValue: '1', }}
            />
            <button>+ Add</button>
            {!amountIsValid && <p>Please enter a valid amount (1-5).</p>}
        </form>
    );
};

const MealItem = props => {
    const cartContext = useContext(CartContext);
    const price = `${props.price.toFixed(2)} €`;

    const addToCartHandler = amount => {
        cartContext.addItem({ id: props.id, name: props.name, amount: amount, price: props.price, });
    };
    return (
        <li className={styles.meal}>
            // ...
            <div>
                <MealItemForm id={props.id} onAddToCart={addToCartHandler} />
            </div>
        </li>
    );
};

const Cart = props => {
    const cartContext = useContext(CartContext);

    const totalAmount = `${cartContext.totalAmount.toFixed(2)} €`;
    const hasItems = cartContext.items.length > 0;

    const cartItemRemoveHandler = id => {
        cartContext.removeItem(id);
    };

    const cartItemAddHandler = item => {
        cartContext.addItem({ ...item, amount: 1 });
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

    return (
        <Modal onClose={props.onClose}>
            {cartItems}
            <div className={styles.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            <div className={styles.actions}>
                <button className={styles['button--alt']} onClick={props.onClose}>
                    Close
                </button>
                {hasItems && <button className={styles.button}>Order</button>}
            </div>
        </Modal>
    );
};
```

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
    "meals": [
        {
            "id": 1,
            "name": "Pizza",
            "description": "The real Italian one",
            "price": 11.99
        },
        {
            "id": 2,
            "name": "Double Cheese Burger",
            "description": "Double cheese, double Yum!",
            "price": 15.99
        },
        {
            "id": 3,
            "name": "Sushi",
            "description": "Tokyo's style!",
            "price": 23.99
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

## Get Request

It is possible to manage a get request in this way:
```javascript
const AvailableMeals = () => {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3333/meals').then(response => {
            // console.log(response.data);
            setMeals(response.data);
        });
    }, []);

    // const mealsList = MEALS.map(meal => {
    const mealsList = meals.map(meal => {
        // ...
    });

    return (
        // ...
    );
};
```

#### Loading State

The loading state can be managed in this way:
```javascript
const AvailableMeals = () => {
    // ...
    // since the use effect send the request as soon as the component is loaded
    // it is possible to use directly the true state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get('http://localhost:3333/meals')
            .then(response => {
                // ...
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // ...

    if (isLoading) {
        return (
            <section className={styles.mealsLoading}>
                <p>Loading...</p>
            </section>
        );
    }

    return (
        // ...
    );
};
```

#### Error State

An error can be managed in this way:
```javascript
const AvailableMeals = () => {
    // ...
    const [error, setError] = useState(undefined);

    useEffect(() => {
        axios
            .get('http://localhost:3334/meals')
            .then(response => {
                // ...
            })
            .catch(response => {
                setError(response.message)
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // ...

    if (!!error) {
        return (
            <section className={styles.mealsError}>
                <p>{error}</p>
            </section>
        );
    }

    return (
        // ...
    );
};
```

## Form Validation

A simple form validation, done using `useRef` can be implemented:
```javascript
const Checkout = props => {
    const [formValidity, setFormValidity] = useState({
        name: true,
        street: true,
        postCode: true,
        city: true,
    });

    const nameRef = useRef();
    const streetRef = useRef();
    const postCodeRef = useRef();
    const cityRef = useRef();

    const confirmHandler = event => {
        event.preventDefault();

        const name = nameRef.current.value;
        const street = streetRef.current.value;
        const postCode = postCodeRef.current.value;
        const city = cityRef.current.value;

        const isNameValid = !isEmpty(name);
        const isStreetValid = !isEmpty(street);
        const isPostCodeValid = isFiveChars(postCode);
        const isCityValid = !isEmpty(city);

        setFormValidity({
            name: isNameValid,
            street: isStreetValid,
            postCode: isPostCodeValid,
            city: isCityValid,
        });

        const isFormValid = isNameValid && isStreetValid && isPostCodeValid && isCityValid;

        if (!isFormValid) {
            return;
        }

        props.onConfirm({
            name,
            street,
            postCode,
            city,
        });
    };

    return (
        <form onSubmit={confirmHandler}>
            <div className={`${styles.control} ${!formValidity.name && styles.invalid}`}>
                <label htmlFor='name'>Your Name</label>
                <input type='text' id='name' ref={nameRef} />
                {!formValidity.name && <p>Please enter a valid Name</p>}
            </div>
            <div className={`${styles.control} ${!formValidity.street && styles.invalid}`}>
                <label htmlFor='street'>Your Street</label>
                <input type='text' id='street' ref={streetRef} />
                {!formValidity.street && <p>Please enter a valid Street</p>}
            </div>
            <div className={`${styles.control} ${!formValidity.postCode && styles.invalid}`}>
                <label htmlFor='post-code'>Your Post Code</label>
                <input type='text' id='post-code' ref={postCodeRef} />
                {!formValidity.postCode && (
                    <p>Please enter a valid Post Code (5 characters long)</p>
                )}
            </div>
            <div className={`${styles.control} ${!formValidity.city && styles.invalid}`}>
                <label htmlFor='city'>Your City</label>
                <input type='text' id='city' ref={cityRef} />
                {!formValidity.city && <p>Please enter a valid City</p>}
            </div>
            <div className={styles.actions}>
                <button type='button' onClick={props.onCancel}>
                    Cancel
                </button>
                <button className={styles.submit}>Confirm</button>
            </div>
        </form>
    );
};
```
see the form section for better error management.

## Submit Order

```javascript
const Cart = props => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    // ...

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
```

```javascript
const cartReducer = (state, action) => {
    // ...

    switch (action.type) {
        // ...
        case 'CLEAR':
        default:
            return defaultCartState;
    }
};

const CartProvider = props => {
    // ...

    const clearCartHandler = id => {
        dispatchCartStateAction({ type: 'CLEAR' });
    };

    const cartContext = {
        // ...
        clearCart: clearCartHandler,
    };

    // ...
};
```

```javascript
const CartContext = createContext({
    // ...
    clearCart: () => {},
});
```

