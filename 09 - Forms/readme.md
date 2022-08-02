# Forms

## Content

- [Catching Events](#catching-events)
- [Validation](#validation)
- [Custom Input Hook](#custom-input-hook)

---

## Catching Events

It is possible to catch and store the current value on an input using `useState`,
and catch the form submit in this way:
```javascript
const SimpleInput = props => {
    const [name, setName] = useState('');

    const nameChangedHandler = event => {
        setName(event.target.value);
    };

    const formSubmitHandler = event => {
        event.preventDefault();

        console.log(name);
    };

    return (
        <form onSubmit={formSubmitHandler}>
            <div className='form-control'>
                <label htmlFor='name'>Your Name</label>
                <input type='text' id='name' onChange={nameChangedHandler} />
            </div>
            <div className='form-actions'>
                <button>Submit</button>
            </div>
        </form>
    );
};
```

## Validation

A basic validation check on the submit is:
```javascript
const SimpleInput = props => {
    const [name, setName] = useState('');
    const [isNameValid, setIsNameValid] = useState(true);

    // ...

    const formSubmitHandler = event => {
        // ...

        if (name.trim() === '') {
            setIsNameValid(false);
            return;
        }

        setIsNameValid(true);
        // ...
    };

    const nameInputClasses = isNameValid ? 'form-control' : 'form-control invalid';
    return (
        <form onSubmit={formSubmitHandler}>
            <div className={nameInputClasses}>
                // ...
                {!isNameValid && <p className='error-text'>Name must be not empty.</p>}
            </div>
            // ...
        </form>
    );
};
```

#### Dynamic Touched

It is possible to dynamically check if the input is valid only if it has been
touched:
```javascript
const SimpleInput = props => {
    const [name, setName] = useState('');
    const [isNameTouched, setIsNameTouched] = useState(false);

    const isNameValid = name !== '';
    const nameInputIsInvalid = !isNameValid && isNameTouched;

    const nameChangedHandler = event => {
        setName(event.target.value);
    };

    const nameBlurHandler = event => {
        setIsNameTouched(true);
    };

    const formSubmitHandler = event => {
        event.preventDefault();

        // all input are considered touched on submit
        setIsNameTouched(true);

        if (!isNameValid) {
            return;
        }

        console.log(name);
        setName('');
        setIsNameTouched(false);
    };

    const nameInputClasses = !nameInputIsInvalid ? 'form-control' : 'form-control invalid';

    return (
        <form onSubmit={formSubmitHandler}>
            <div className={nameInputClasses}>
                <label htmlFor='name'>Your Name</label>
                <input
                    value={name}
                    type='text'
                    id='name'
                    onChange={nameChangedHandler}
                    onBlur={nameBlurHandler}
                />
                { nameInputIsInvalid && <p className='error-text'>Name must be not empty.</p> }
            </div>
            // ...
        </form>
    );
};
```

#### Form Validity

It is possible to manage the overall status of the form, considering multiple
input in this way:
```javascript
const SimpleInput = props => {
    // ...

    const isFromValid = isNameValid; // && other inputs

    // ...

    return (
        <form onSubmit={formSubmitHandler}>
            // ...
            <div className='form-actions'>
                <button disabled={!isFromValid}>Submit</button>
            </div>
        </form>
    );
};
```
with a style:
```css
// ...

button:disabled,
button:disabled:hover,
button:disabled:active {
    background-color: #cccccc;
    color: #292929;
    border-color: #cccccc;
    cursor: not-allowed;
}

// ...
```

## Custom Input Hook

It is possible to define a generic hook to manage the validation of an input:
```javascript
const useInput = validateValue => {
    const [value, setValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const isValid = validateValue(value);
    const hasError = !isValid && isTouched;

    const changedHandler = event => {
        setValue(event.target.value);
    };

    const blurHandler = event => {
        setIsTouched(true);
    };

    const reset = () => {
        setValue('')
        setIsTouched(false);
    };

    return {
        value,
        isValid,
        hasError,
        changedHandler,
        blurHandler,
        reset,
    };
};
```
and integrate it in the previous component in this way:
```javascript
const nameValidator = text => text.trim() !== '';
const emailValidator = email =>
    email !== '' && email.match(/[0-9a-zA-Z.]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]{2,3}/);

const SimpleInput = props => {
    const {
        value: name,
        isValid: isNameValid,
        hasError: nameInputIsInvalid,
        changedHandler: nameChangedHandler,
        blurHandler: nameBlurHandler,
        reset: resetName,
    } = useInput(nameValidator);

    const {
        value: email,
        isValid: isEmailValid,
        hasError: emailInputIsInvalid,
        changedHandler: emailChangedHandler,
        blurHandler: emailBlurHandler,
        reset: resetEmail,
    } = useInput(emailValidator);

    // not needed anymore
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [isNameValid, setIsNameValid] = useState(false);
    // const [isNameTouched, setIsNameTouched] = useState(false);
    // const [isEmailTouched, setIsEmailTouched] = useState(false);

    // const isNameValid = name !== '';
    // const nameInputIsInvalid = !isNameValid && isNameTouched;
    // const isEmailValid =
    //     email !== '' && email.match(/[0-9a-zA-Z.]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]{2,3}/);
    // const emailInputIsInvalid = !isEmailValid && isEmailTouched;
    const isFromValid = isNameValid && isEmailValid; // && other inputs

    // useEffect(() => {
    //     if (isNameValid) {
    //         console.log('name is valid!');
    //     }
    // }, [isNameValid]);

    // const nameChangedHandler = event => {
    //     setName(event.target.value);
    // };

    // const nameBlurHandler = event => {
    //     setIsNameTouched(true);
    // };

    // const emailChangedHandler = event => {
    //     setEmail(event.target.value);
    // };

    // const emailBlurHandler = event => {
    //     setIsEmailTouched(true);
    // };

    const formSubmitHandler = event => {
        event.preventDefault();

        // all input are considered touched on submit
        // setIsNameTouched(true);
        // setIsEmailTouched(true);

        // if (!isNameValid) {
        if (!isFromValid) {
            return;
        }
        // if (name.trim() === '') {
        //     setIsNameValid(false);
        //     return;
        // }

        // setIsNameValid(true);
        console.log(name, email);
        // setName('');
        // setIsNameTouched(false);
        resetName()
        // setEmail('');
        // setIsEmailTouched(false);
        resetEmail()
    };

    // ...
};
```

#### useReducer

the custom hook can be rewritten using the `useReducer` hook in this way:
```javascript
const inputInitialState = {
    value: '',
    isTouched: false,
};

const inputStateReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT':
            return {
                ...state,
                value: action.value,
            };
        case 'BLUR':
            return {
                ...state,
                isTouched: true,
            };
        case 'RESET':
        default:
            return inputInitialState;
    }
};

const useInput = validateValue => {
    const [state, dispatch] = useReducer(inputStateReducer, inputInitialState);

    const isValid = validateValue(state.value);
    const hasError = !isValid && state.isTouched;

    const changedHandler = event => {
        dispatch({ type: 'INPUT', value: event.target.value });
    };

    const blurHandler = event => {
        dispatch({ type: 'BLUR' });
    };

    const reset = () => {
        dispatch({ type: 'RESET' });
    };

    return {
        value: state.value,
        isValid,
        hasError,
        changedHandler,
        blurHandler,
        reset,
    };
};
```

