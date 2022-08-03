import { useEffect, useState } from 'react';

const SimpleInput = props => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // const [isNameValid, setIsNameValid] = useState(false);
    const [isNameTouched, setIsNameTouched] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);

    const isNameValid = name !== '';
    const nameInputIsInvalid = !isNameValid && isNameTouched;
    const isEmailValid =
        email !== '' && email.match(/[0-9a-zA-Z.]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]{2,3}/);
    const emailInputIsInvalid = !isEmailValid && isEmailTouched;
    const isFromValid = isNameValid && isEmailValid; // && other inputs

    // useEffect(() => {
    //     if (isNameValid) {
    //         console.log('name is valid!');
    //     }
    // }, [isNameValid]);

    const nameChangedHandler = event => {
        setName(event.target.value);

        // if (event.target.value.trim() !== '') {
        //     setIsNameValid(true);
        //     return;
        // }
    };

    const nameBlurHandler = event => {
        setIsNameTouched(true);
        // if (name.trim() === '') {
        //     setIsNameValid(false);
        //     return;
        // }
    };

    const emailChangedHandler = event => {
        setEmail(event.target.value);
    };

    const emailBlurHandler = event => {
        setIsEmailTouched(true);
    };

    const formSubmitHandler = event => {
        event.preventDefault();

        // all input are considered touched on submit
        setIsNameTouched(true);
        setIsEmailTouched(true);

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
        setName('');
        setIsNameTouched(false);
        setEmail('');
        setIsEmailTouched(false);
    };

    // const nameInputClasses = isNameValid ? 'form-control' : 'form-control invalid';
    const nameInputClasses = !nameInputIsInvalid ? 'form-control' : 'form-control invalid';
    const emailInputClasses = !emailInputIsInvalid ? 'form-control' : 'form-control invalid';

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
                {
                    //!isNameValid
                    nameInputIsInvalid && <p className='error-text'>Name must be not empty.</p>
                }
            </div>
            <div className={emailInputClasses}>
                <label htmlFor='email'>Your Email</label>
                <input
                    value={email}
                    type='email'
                    id='email'
                    onChange={emailChangedHandler}
                    onBlur={emailBlurHandler}
                />
                {emailInputIsInvalid && <p className='error-text'>Must be a valid email.</p>}
            </div>
            <div className='form-actions'>
                <button disabled={!isFromValid}>Submit</button>
            </div>
        </form>
    );
};

export default SimpleInput;
