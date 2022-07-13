import { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = props => {
    const now = new Date();
    const today = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${now.getDate()}`;

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    // const [userInput, setUserInput] = useState({
    //     title: '',
    //     amount: '',
    //     date: '',
    // });
    //

    const titleChangeHandler = event => {
        setTitle(event.target.value);
        // setUserInput(prevState => {
        //     return {
        //         ...prevState,
        //         title: event.target.value,
        //     };
        // });
    };
    const amountChangeHandler = event => {
        setAmount(event.target.value);
        // setUserInput(prevState => {
        //     return {
        //         ...prevState,
        //         amount: event.target.value,
        //     };
        // });
    };
    const dateChangeHandler = event => {
        setDate(event.target.value);
        // setUserInput(prevState => {
        //     return {
        //         ...prevState,
        //         date: event.target.value,
        //     };
        // });
    };

    const submitHandler = event => {
        // prevent the automatic page reload preformed on submit
        event.preventDefault();
        const expense = {
            title: title,
            amount: +amount,
            date: new Date(date),
        };

        // console.log(expense);
        props.onSaveExpenseData(expense);
        setTitle('');
        setAmount('');
        setDate('');
    };

    return (
        <form onSubmit={submitHandler}>
            <div className='new-expense__controls'>
                <div className='new-expense__control'>
                    <label>Title</label>
                    <input type='text' value={title} onChange={titleChangeHandler} />
                </div>
                <div className='new-expense__control'>
                    <label>Amount</label>
                    <input
                        type='number'
                        min='0.01'
                        step='0.01'
                        value={amount}
                        onChange={amountChangeHandler}
                    />
                </div>
                <div className='new-expense__control'>
                    <label>Date</label>
                    <input
                        type='date'
                        min='2019-01-01'
                        max={today}
                        value={date}
                        onChange={dateChangeHandler}
                    />
                </div>
            </div>
            <div className='new-expense__actions'>
                <button onClick={props.onCancel} type='button'>Cancel</button>
                <button type='submit'>Add</button>
            </div>
        </form>
    );
};

export default ExpenseForm;
