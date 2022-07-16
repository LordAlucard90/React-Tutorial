# Context And Effects

## Content

- [Local Storage](#local-storage)
- [useEffect](#useeffect)
- [useReducer](#usereducer)
- [Context](#context)
- [Hooks Usage](#hooks-usage)
- [useImperativeHandle](#useimperativehandle)

---


## Local Storage

The local storage is used to store data in the browser that can be afterwads
retrieved:
```javascript
localStorage.setItem('isLoggedIn', 'true')
const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn'));
localStorage.removeItem('isLoggedIn')
```

## useEffect

`useEffect` is an hook which usage is to execute some code only after some
state changed:
```javascript
useEffect(effectFn, [oprionalDependencies])
```
for example:
```javascript
useEffect(() => {
    const isUserLoggedIn = localStorage.getItem('isLoggedIn');

    if (isUserLoggedIn === 'yes') {
        setIsLoggedIn(true);
    }
}, []);
```
In the case there are no dependencies and this code will be only executed
the first time the component is created and on feature renders will be ignored.
If the code inside the effect were placed outside the hook, this would have
created an infinite loop.

A more common way to use `useEffect` is to add in the dependencies a state,
so that every time one of the listed states changes, the code is re-evaluated:
```javascript
useEffect(() => {
    setFormIsValid(
        enteredEmail.target.value.includes('@') && enteredPassword.trim().length > 6,
    );
}, [enteredEmail, enteredPassword]);
```
In the dependencies array should not do:
- state update function, like `setFormIsValid`
- built-in functions, like `localStorage`
- variables or functions defined outside the component

#### useEffect Cleanup

The code above will be executed every time one of the parameter changes.
A better solution is to wait for a certain period fo time and do the validation
only after the user did not entered nothing for like half second.
It is possible to wrap the code inside a time out and use a cleanup function  
to reset a timeout.
```javascript
useEffect(() => {
    const timer = setFormIsValid(() => {
        console.log('checking validity.');
        enteredEmail.includes('@') && enteredPassword.trim().length > 6;
    }, 500);

    return () => {
        console.log('Cleanup');
        clearTimeout(timer);
    };
}, [enteredEmail, enteredPassword]);
```
the cleanup function is the function returned by the `useEffect`, it is executed
only from the the second time that effect take place, after the code inside
the effect runs, and when the component is destroyed.

## useReducer

`useReducer` is a replacement for `useState` for managing complex states,
for example when a state depends on other states of the component,
as the form validity:
```javascript
const [state, dispatchFunction] = useReducer(reducerFn, initialState, initFn);
```
for example:
```javascript
const emailReducer = (state, action) => {
    switch (action.type) {
        case 'USER_INPUT':
            return { value: action.value, isValid: action.value.includes('@') };
        case 'INPUT_BLUR':
            return { value: state.value, isValid: state.value.includes('@') };
        default:
            return { value: '', isValid: false };
    }
};

// ...

const Login = props => {
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState();
    // ...

    const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         console.log('checking validity.');
    //         setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
    //     }, 500);
    //
    //     return () => {
    //         console.log('Cleanup');
    //         clearTimeout(timer);
    //     };
    // }, [enteredEmail, enteredPassword]);

    const emailChangeHandler = event => {
        // setEnteredEmail(event.target.value);
        dispatchEmail({ type: 'USER_INPUT', value: event.target.value });

        // setFormIsValid(event.target.value.includes('@') && enteredPassword.trim().length > 6);
        setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
    };

    // ...

    const validateEmailHandler = () => {
        // setEmailIsValid(enteredEmail.includes('@'));
        dispatchEmail({ type: 'INPUT_BLUR' });
    };

    // ...

    const submitHandler = event => {
        event.preventDefault();
        // props.onLogin(enteredEmail, enteredPassword);
        props.onLogin(emailState.value, enteredPassword);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${
                        // emailIsValid === false ? classes.invalid : ''
                        emailState.isValid === false ? classes.invalid : ''
                    }`}>
                    <label htmlFor='email'>E-Mail</label>
                    <input
                        type='email'
                        id='email'
                        value={emailState.value /* enteredEmail */}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                // ...
            </form>
        </Card>
    );
};

export default Login;
```

#### Combination With useEffect

It is possible to destrucute the email and password validity state in combination
with `useEffect` dependencies to re-evaluate the form state only if the validity
state changes:
```javascript
const { isValid: emailIsValid } = emailState;
const { isValid: passwordIsValid } = passwordState;

useEffect(() => {
    const timer = setTimeout(() => {
        console.log('checking validity.');
        // setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
        setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
        console.log('Cleanup');
        clearTimeout(timer);
    };
}, [
    // enteredEmail,
    // enteredPassword
    emailIsValid,
    passwordIsValid,
]);
```
also this syntax works in the same way:
```javascript
useEffect(() => {
    // ...
}, [
    emailState.isValid,
    passwordState.isValid
]);
```

## Context

Very often the state of a component must be moved from a place to another very
far away in the component tree, this leads of a lot of props passed around,
where a lot of components do not need this properties but only some parent
or child needs it.

It is possible to create a shared state using the context api:
```javascript
const AuthContext = React.createContext({
    isLoggedIn: false
});

export default AuthContext;
```
It receive as input the initial state and returns an object that also contains
components (therefore pascal case name).

The context must the provided and consumed.

#### Provider

It is possible to provide the context to a component by wrapping it with:
```javascript
const [isLoggedIn, setIsLoggedIn] = useState(false);
// ...
return (
    <AuthContext.Provider value={{ isLoggedIn: isLoggedIn }}>
        // <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
        <MainHeader onLogout={logoutHandler} />
        // ...
    </AuthContext.Provider>
);
```
now all the descendent of the wrapped components will have the context reference.
In this example the context is provided all application wide.\
The actual context state can be consistently updated in all the application,
using the isLoggedIn state. 

#### Consumer Component

The consumer component works like the provider by wrapping the components 
where it must used:
```javascript
const Navigation = props => {
    return (
        <AuthContext.Consumer>
            {context => {
                return (
                    <nav className={classes.nav}>
                        <ul>
                            {
                                context.isLoggedIn && (
                                    <li>
                                        <a href='/'>Users</a>
                                    </li>
                                )
                            }
                            {
                                context.isLoggedIn && (
                                    <li>
                                        <a href='/'>Admin</a>
                                    </li>
                                )
                            }
                            {
                                context.isLoggedIn && (
                                    <li>
                                        <button onClick={props.onLogout}>Logout</button>
                                    </li>
                                )
                            }
                        </ul>
                    </nav>
                );
            }}
        </AuthContext.Consumer>
    );
};
```
to make the code above work, it is necessary to add the current value and 
keep it updated with the current value:
```javascript
return (
    <AuthContext.Provider value={{ isLoggedIn: isLoggedIn }}>
        // ...
    </AuthContext.Provider>
);
```


#### useContext

A Cleaner implementation can be accomplished using the 'useContext' hook:
```javascript
const Navigation = props => {
    const context = useContext(AuthContext);

    return (
        <nav className={classes.nav}>
            <ul>
                {
                    // props.isLoggedIn
                    context.isLoggedIn && (
                        <li>
                            <a href='/'>Users</a>
                        </li>
                    )
                }
                {
                    // props.isLoggedIn
                    context.isLoggedIn && (
                        <li>
                            <a href='/'>Admin</a>
                        </li>
                    )
                }
                {
                    // props.isLoggedIn
                    context.isLoggedIn && (
                        <li>
                            <button onClick={props.onLogout}>Logout</button>
                        </li>
                    )
                }
            </ul>
        </nav>
    );
};
```

#### Context Update

It is possible to avoid the passing of the methos callback across multiple 
components, by adding it to the context state:
```javascript
const Navigation = props => {
    const context = useContext(AuthContext);

    return (
        <nav className={classes.nav}>
            <ul>
                // ...
                {
                    context.isLoggedIn && (
                        <li>
                            // <button onClick={props.onLogout}>Logout</button>
                            <button onClick={context.onLogout}>Logout</button>
                        </li>
                    )
                }
            </ul>
        </nav>
    );
};
```

#### Dedicated Context Component

It is possible to move all the logic of the login state inside a new root 
provider component:
```javascript
const AuthContext = React.createContext({
    isLoggedIn: false,
    // default values, useful for autocompletion
    onLogout: () => {},
    // default values, useful for autocompletion
    onLogIn: (email, password) => {},
});

export const AuthContextProvider = props => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginHandler = (email, password) => {
        localStorage.setItem('isLoggedIn', 'yes');
        setIsLoggedIn(true);
    };

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const isUserLoggedIn = localStorage.getItem('isLoggedIn');

        if (isUserLoggedIn === 'yes') {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                onLogin: loginHandler,
                onLogout: logoutHandler,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
};
```
It is necessaty to provide this context at the very top:
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>,
);
```
and it is possible to use them in this way:
```javascript
function App() {
    // console.log(localStorage.getItem('isLoggedIn'))
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    //
    // const loginHandler = (email, password) => {
    //     // We should of course check email and password
    //     // But it's just a dummy/ demo anyways
    //     localStorage.setItem('isLoggedIn', 'yes');
    //     setIsLoggedIn(true);
    // };
    //
    // useEffect(() => {
    //     const isUserLoggedIn = localStorage.getItem('isLoggedIn');
    //
    //     if (isUserLoggedIn === 'yes') {
    //         setIsLoggedIn(true);
    //     }
    // }, []);
    //
    // const logoutHandler = () => {
    //     localStorage.removeItem('isLoggedIn');
    //     setIsLoggedIn(false);
    // };

    const context = useContext(AuthContext);
    return (
        <>
            <MainHeader />
            <main>
                {/* !isLoggedIn && <Login onLogin={loginHandler} /> */}
                {/* isLoggedIn && <Home onLogout={logoutHandler} /> */}
                {!context.isLoggedIn && <Login />}
                {context.isLoggedIn && <Home />}
            </main>
        </>
    );
}

const Home = props => {
    const context = useContext(AuthContext);
    return (
        <Card className={classes.home}>
            <h1>Welcome back!</h1>
            // <Button onClick={props.onLogout}>Logout</Button>
            <Button onClick={context.onLogout}>Logout</Button>
        </Card>
    );
};

const Login = props => {
    const context = useContext(AuthContext);

    // ...

    const submitHandler = event => {
        event.preventDefault();
        // props.onLogin(emailState.value, passwordState.value);
        context.onLogin(emailState.value, passwordState.value);
    };

    return (
        // ...
    );
};
```

#### Limitations

The context is not a replacement for the props, props allows re-usability.
Therefore is not optimized for high frequency changes.

## Hooks Usage

- Use only in React functions (functional components, custom hooks)
- Call hook only at the top level of the function, 
not inside nested function or blocks like if.
- be sure to add all the dependencies inside `useEffect` unless there is a good
reason to omit it.

## useImperativeHandle

With `useImperativeHandle` in combination with `forwardRef`, it is possible to
use the `ref` prop in a custom component and, using this reference, expose  
the elements defined in the `useImperativeHandle` hook:
 ```javascript
const Login = React.forwardRef((props, ref) => {
    const inputRef = useRef();

    const activate = () => {
        inputRef.current.focus();
    };

    useImperativeHandle(ref, () => {
        return { focus: activate };
    });
    return (
        // ...
        <input
            // ...
            ref={inputRef}
            />
        // ...
    );
});

const Login = props => {
    // ...
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    // ...

    const submitHandler = event => {
        // ...
        if (formIsValid) {
            context.onLogin(emailState.value, passwordState.value);
        } else if (!emailState.isValid) {
            emailInputRef.current.focus();
        } else {
            passwordInputRef.current.focus();
        }
    };

    return (
        // ...
        <Input
            ref={emailInputRef}
            id='email'
            label='E-Mail'
            type='email'
            isValid={emailState.isValid}
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
        />
        <Input
            ref={passwordInputRef}
            id='password'
            label='Password'
            type='password'
            isValid={passwordState.isValid}
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
        />
        // ...
    );
};
 ```

