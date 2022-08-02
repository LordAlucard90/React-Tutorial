import useInput from '../hooks/use-input';

const nameValidator = text => text.trim() !== '';
const lastNameValidator = text => text.trim() !== '';
const emailValidator = email =>
    email !== '' && email.match(/[0-9a-zA-Z.]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]{2,3}/);

const BasicForm = props => {
    const {
        value: name,
        isValid: isNameValid,
        hasError: hasNameError,
        changedHandler: nameChangedHandler,
        blurHandler: nameBlurHandler,
        reset: resetName,
    } = useInput(nameValidator);

    const {
        value: lastName,
        isValid: isLastNameValid,
        hasError: hasLastNameError,
        changedHandler: lastNameChangedHandler,
        blurHandler: lastNameBlurHandler,
        reset: resetLastName,
    } = useInput(lastNameValidator);

    const {
        value: email,
        isValid: isEmailValid,
        hasError: hasEmailError,
        changedHandler: emailChangedHandler,
        blurHandler: emailBlurHandler,
        reset: resetEmail,
    } = useInput(emailValidator);

    const isFormValid = isNameValid && isLastNameValid && isEmailValid;

    const onSubmitHandler = event => {
        event.preventDefault();

        if (!isFormValid) {
            return;
        }

        console.log(name, lastName, email);
        resetName();
        resetLastName();
        resetEmail();
    };

    return (
        <form onSubmit={onSubmitHandler}>
            <div className='control-group'>
                <div className={`form-control ${hasNameError && 'invalid'}`}>
                    <label htmlFor='name'>First Name</label>
                    <input
                        type='text'
                        id='name'
                        value={name}
                        onChange={nameChangedHandler}
                        onBlur={nameBlurHandler}
                    />
                    {hasNameError && <p className='error-text'>Please enter a valid Name</p>}
                </div>
                <div className={`form-control ${hasLastNameError && 'invalid'}`}>
                    <label htmlFor='last-name'>Last Name</label>
                    <input
                        type='text'
                        id='last-name'
                        value={lastName}
                        onChange={lastNameChangedHandler}
                        onBlur={lastNameBlurHandler}
                    />
                    {hasLastNameError && <p className='error-text'>Please enter a valid Last Name</p>}
                </div>
            </div>
            <div className={`form-control ${hasEmailError && 'invalid'}`}>
                <label htmlFor='email'>E-Mail Address</label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={emailChangedHandler}
                    onBlur={emailBlurHandler}
                />
                {hasEmailError && <p className='error-text'>Please enter a valid Email</p>}
            </div>
            <div className='form-actions'>
                <button disabled={!isFormValid}>Submit</button>
            </div>
        </form>
    );
};

export default BasicForm;
