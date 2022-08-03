import { useState } from 'react';
import ExpenseDate from './ExpenseDate';
import Card from '../UI/Card';
import './ExpenseItem.css';

const ExpenseItem = props => {
    // const expenseDate = new Date(2022, 2, 4);
    // const expenseTitle = 'My Important expense';
    // const expenseAmount = 42.24;

    // return (
    //     <div className='expense-item'>
    //         <div>{expenseDate.toISOString()}</div>
    //         <div className='expense-item__description'>
    //             <h2>{expenseTitle}</h2>
    //             <div className='expense-item__price'>{expenseAmount} €</div>
    //         </div>
    //     </div>
    // );
    //

    // const day = props.date.toLocaleString('en-US', { day: '2-digit' });
    // const month = props.date.toLocaleString('en-US', { month: 'long' });
    // const year = props.date.getFullYear();

    // console.log('ExpenseItem evaluated');
    // let title = props.title;
    const [title, setTitle] = useState(props.title);
    const clickHandler = () => {
        console.log('Clicked!');
        // title = 'Changed!';
        setTitle('Changed!');
        console.log(title); // logs the old value
    };
    return (
        <Card className='expense-item'>
            {
                // <div className='expense-item'>
            }
            {
                // <div>
                //     <div>{day}</div>
                //     <div>{month}</div>
                //     <div>{year}</div>
                // </div>
            }
            <ExpenseDate date={props.date} />
            <div className='expense-item__description'>
                <h2>{title}</h2>
                <div className='expense-item__price'>{props.amount} €</div>
            </div>
            <button onClick={clickHandler}>Change Title</button>
            {
                // </div>
            }
        </Card>
    );
};

export default ExpenseItem;
