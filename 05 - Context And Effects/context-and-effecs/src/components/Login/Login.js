import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import AuthContext from '../../store/auth-context';

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

const passwordReducer = (state, action) => {
    switch (action.type) {
        case 'USER_INPUT':
            return { value: action.value, isValid: action.value.trim().length > 6 };
        case 'INPUT_BLUR':
            return { value: state.value, isValid: state.value.trim().length > 6 };
        default:
            return { value: '', isValid: false };
    }
};

const Login = props => {
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState();
    // const [enteredPassword, setEnteredPassword] = useState('');
    // const [passwordIsValid, setPasswordIsValid] = useState();
    const [formIsValid, setFormIsValid] = useState(false);
    const context = useContext(AuthContext);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
        value: '',
        isValid: null,
    });

    // const { isValid: emailIsValid } = emailState;
    // const { isValid: passwordIsValid } = passwordState;

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('checking validity.');
            // setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
            // setFormIsValid(emailIsValid && passwordIsValid);
            setFormIsValid(emailState.isValid && passwordState.isValid);
        }, 500);

        return () => {
            console.log('Cleanup');
            clearTimeout(timer);
        };
    }, [
        // enteredEmail, enteredPassword
        // emailIsValid, passwordIsValid,
        emailState.isValid,
        passwordState.isValid,
    ]);

    const emailChangeHandler = event => {
        // setEnteredEmail(event.target.value);
        dispatchEmail({ type: 'USER_INPUT', value: event.target.value });

        // setFormIsValid(event.target.value.includes('@') && enteredPassword.trim().length > 6);
        // setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
    };

    const passwordChangeHandler = event => {
        // setEnteredPassword(event.target.value);
        dispatchPassword({ type: 'USER_INPUT', value: event.target.value });

        // setFormIsValid(event.target.value.trim().length > 6 && enteredEmail.includes('@'));
        // setFormIsValid(event.target.value.trim().length > 6 && emailState.isValid);
    };

    const validateEmailHandler = () => {
        // setEmailIsValid(enteredEmail.includes('@'));
        dispatchEmail({ type: 'INPUT_BLUR' });
    };

    const validatePasswordHandler = () => {
        // setPasswordIsValid(enteredPassword.trim().length > 6);
        dispatchPassword({ type: 'INPUT_BLUR' });
    };

    const submitHandler = event => {
        event.preventDefault();
        // props.onLogin(enteredEmail, enteredPassword);
        // props.onLogin(emailState.value, passwordState.value);
        if (formIsValid) {
            context.onLogin(emailState.value, passwordState.value);
        } else if (!emailState.isValid) {
            emailInputRef.current.focus();
        } else {
            passwordInputRef.current.focus();
        }
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                {
                    // <div
                    //     className={`${classes.control} ${
                    //         // emailIsValid === false ? classes.invalid : ''
                    //         emailState.isValid === false ? classes.invalid : ''
                    //     }`}>
                    //     <label htmlFor='email'>E-Mail</label>
                    //     <input
                    //         type='email'
                    //         id='email'
                    //         value={emailState.value /* enteredEmail */}
                    //         onChange={emailChangeHandler}
                    //         onBlur={validateEmailHandler}
                    //     />
                    // </div>
                }
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
                {
                    // <div
                    //     className={`${classes.control} ${
                    //         // passwordIsValid === false ? classes.invalid : ''
                    //         passwordState.isValid === false ? classes.invalid : ''
                    //     }`}>
                    //     <label htmlFor='password'>Password</label>
                    //     <input
                    //         type='password'
                    //         id='password'
                    //         value={passwordState.value /* enteredPassword */}
                    //         onChange={passwordChangeHandler}
                    //         onBlur={validatePasswordHandler}
                    //     />
                    // </div>
                }
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
                <div className={classes.actions}>
                    {
                        // <Button type='submit' className={classes.btn} disabled={!formIsValid}>
                    }
                    <Button type='submit' className={classes.btn}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
