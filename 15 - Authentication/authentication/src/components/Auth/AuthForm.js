import axios from 'axios';
import { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_SECONDS = 10 * 1000;

const AuthForm = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const authContext = useContext(AuthContext);
    const history = useHistory();

    const switchAuthModeHandler = () => {
        setIsLogin(prevState => !prevState);
    };

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
                    const {
                        accessToken,
                        user: { id: userId },
                    } = response.data;
                    const expirationTime = new Date().getTime() + TEN_SECONDS;
                    authContext.login(userId, accessToken, expirationTime);
                    history.replace('/');
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
                    const {
                        accessToken,
                        user: { id: userId },
                    } = response.data;
                    authContext.login(userId, accessToken);
                    history.replace('/');
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
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input ref={emailRef} type='email' id='email' required />
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input ref={passwordRef} type='password' id='password' required />
                </div>
                <div className={classes.actions}>
                    {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
                    {isLoading && <p>Sending request...</p>}
                    <button
                        type='button'
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}>
                        {isLogin ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AuthForm;
