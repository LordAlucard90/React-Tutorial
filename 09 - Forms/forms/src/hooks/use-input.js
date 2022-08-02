import { useReducer, useState } from 'react';

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

// const useInput = validateValue => {
//     const [value, setValue] = useState('');
//     const [isTouched, setIsTouched] = useState(false);
//
//     const isValid = validateValue(value);
//     const hasError = !isValid && isTouched;
//
//     const changedHandler = event => {
//         setValue(event.target.value);
//     };
//
//     const blurHandler = event => {
//         setIsTouched(true);
//     };
//
//     const reset = () => {
//         setValue('');
//         setIsTouched(false);
//     };
//
//     return {
//         value,
//         isValid,
//         hasError,
//         changedHandler,
//         blurHandler,
//         reset,
//     };
// };

export default useInput;
