# Authentication

## Content

- [Server](#server)
- [Signin And Signup](#signin-and-signup)
- [Auth State](#auth-state)
- [Protected Requests](#protected-requests)
- [Page Guards](#page-guards)
- [Keep Auth State](#keep-auth-state)
- [Auto Logout](#auto-logout)

---

## Server

In the course is used [firebase](https://firebase.google.com/),
but I prefer something local like
[json-server](https://github.com/typicode/json-server),
since it is needed the authentication I'll use 
[json-server-auth](https://github.com/jeremyben/json-server-auth),
```bash
npm install -g json-server-auth

json-server-auth --watch db.json -r routes.json -p 3333
# server listening at http://localhost:3333
# port 3000 the default one is used by react

# user creation
curl -X POST http://localhost:3333/register \
    -H 'Content-Type: application/json'\
    -d '{"email":"user@example.com","password":"stron-password"}'
```

the content of `db.json` must be:
```json
{
  "users": []
}
```
while `routes.json` should be:
```json
{
  "users": 600
}
```
it works like linux, [**owner**/**logged**/**public**], `4` read, `2` write.

## Signin And Signup

It is possible to manage the Singin and Sinup requests 
and diplay the user a message in case something goes wrong in this way:
```javascript
const AuthForm = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // ...

    const submitHandler = event => {
        event.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        setIsLoading(true);
        if (isLogin) {
            axios
                .post('http://localhost:3333/login', {
                    email,
                    password,
                })
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    var message = 'Authentication failed.';
                    if (!!err?.response?.data) {
                        message = err.response.data;
                    }
                    alert(message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            axios
                .post('http://localhost:3333/register', {
                    email,
                    password,
                })
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    var message = 'Authentication failed.';
                    if (!!err?.response?.data) {
                        message = err.response.data;
                    }
                    alert(message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                // ...
                <div className={classes.actions}>
                    {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
                    {isLoading && <p>Sending request...</p>}
                    // ...
                </div>
            </form>
        </section>
    );
};
```

## Auth State

It is possible to manage auth state after the login defining an auth context:
```javascript
const AuthContext = createContext({
    userId: undefined,
    token: '',
    isLoggedIn: false,
    login: token => { },
    logout: () => { },
});

export const AuthContextProvider = props => {
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(undefined);

    const isLoggedIn = !!token;

    const loginHangler = (userId, token) => {
        setToken(token);
        setUserId(userId);
    };

    const logoutHangler = () => {
        setToken('');
        setUserId(undefined);
    };

    const context = {
        userId: userId,
        token: token,
        isLoggedIn: isLoggedIn,
        login: loginHangler,
        logout: logoutHangler,
    };

    return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
```
and using it during the login:
```javascript
const AuthForm = () => {
    // ...
    const authContext = useContext(AuthContext);

    // ...

    const submitHandler = event => {
        // ...

        setIsLoading(true);
        if (isLogin) {
            axios
                .post('http://localhost:3333/login', { email, password, })
                .then(response => {
                    const {
                        accessToken,
                        user: { id: userId },
                    } = response.data;
                    authContext.login(userId, accessToken);
                })
                .catch(err => { /* ... */ })
                .finally(() => { /* ... */ });
        } else {
            axios
                .post('http://localhost:3333/register', { email, password, })
                .then(response => {
                    const {
                        accessToken,
                        user: { id: userId },
                    } = response.data;
                    authContext.login(userId, accessToken);
                })
                .catch(err => { /* ... */ })
                .finally(() => { /* ... */ });
        }
    };

    return (
        // ...
    );
};
```
and in the navigation bar to display the correct links:
```javascript
const MainNavigation = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <header className={classes.header}>
            <Link to='/'>
                <div className={classes.logo}>React Auth</div>
            </Link>
            <nav>
                <ul>
                    {!isLoggedIn && (
                        <li>
                            <Link to='/auth'>Login</Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <Link to='/profile'>Profile</Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <button>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};
```

## Protected Requests

It is now possible to use the token to make secured request 
like the password update:
```javascript
const ProfileForm = () => {
    const passwordRef = useRef();
    const { userId, token, logout } = useContext(AuthContext);

    const submitHandler = event => {
        event.preventDefault();

        axios
            .patch(
                `http://localhost:3333/users/${userId}`,
                {
                    password: passwordRef.current.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then(response => {
                // forcing the user to login again
                logout()
            })
            .catch(err => {
                var message = 'Update failed.';
                if (!!err?.response?.data) {
                    message = err.response.data;
                }
                alert(message);
            });
    };

    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input ref={passwordRef} type='password' id='new-password' />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
};
```

## Page Guards

It is possible to remove protected routes from the routes' list if the user
is no loggeg in, in this way:
```javascript
function App() {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <Layout>
            <Switch>
                <Route path='/' exact>
                    <HomePage />
                </Route>
                {!isLoggedIn && (
                    <Route path='/auth'>
                        <AuthPage />
                    </Route>
                )}
                {isLoggedIn && (
                    <Route path='/profile'>
                        <UserProfile />
                    </Route>
                )}
            </Switch>
        </Layout>
    );
}

export default App;
```

## Keep Auth State

It is possible to keep the user state across reloads using the local storage:
```javascript
export const AuthContextProvider = props => {
    const initialToken = localStorage.getItem('token');
    const initialUserId = localStorage.getItem('userId');
    const [token, setToken] = useState(initialToken);
    const [userId, setUserId] = useState(initialUserId);

    const isLoggedIn = !!token;

    const loginHangler = (userId, token) => {
        setToken(token);
        setUserId(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    };

    const logoutHangler = () => {
        setToken('');
        setUserId(undefined);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    // ...
};
```
the local storage can be accessed from the Browser DevTools under 
Application > Local Storage.

## Auto Logout

It is possible to automatically logout the user ater the token is exiped
with a simple timer, but it is necessary to correctly manage it across
application reloads in the local storage:
```javascript
// ...
const calculareRemainingTime = expirationTime => {
    const currentTime = new Date().getTime();
    return expirationTime - currentTime;
};

const retrieveStoredToken = expirationTime => {
    const initialToken = localStorage.getItem('token');
    const initialUserId = +localStorage.getItem('userId');
    const initialExpirationTime = +localStorage.getItem('expirationTime');

    const remainingTime = calculareRemainingTime(initialExpirationTime);
    if (remainingTime <= 0) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationTime');
        return { initialToken: null, initialUserId: null, initialExpirationTime: null };
    }
    return {
        initialToken,
        initialUserId,
        initialExpirationTime,
    };
};

let logoutTimer;

export const AuthContextProvider = props => {
    const { initialToken, initialUserId, initialExpirationTime } = retrieveStoredToken();
    const [token, setToken] = useState(initialToken);
    const [userId, setUserId] = useState(initialUserId);

    const isLoggedIn = !!token;

    const logoutHangler = useCallback(() => {
        setToken('');
        setUserId(undefined);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationTime');
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHangler = (userId, token, expirationTime) => {
        setToken(token);
        setUserId(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationTime', expirationTime);
        const remainingTime = calculareRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHangler, remainingTime);
    };

    useEffect(() => {
        if (!!initialExpirationTime) {
            const remainingTime = calculareRemainingTime(initialExpirationTime);
            logoutTimer = setTimeout(logoutHangler, remainingTime);
        }
    }, [initialExpirationTime, logoutHangler]);

    // ...
};
```

