import ExpenseDate from './ExpenseDate';
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
    return (
        <div className='expense-item'>
            {
                // <div>
                //     <div>{day}</div>
                //     <div>{month}</div>
                //     <div>{year}</div>
                // </div>
            }
            <ExpenseDate date={props.date} />
            <div className='expense-item__description'>
                <h2>{props.title}</h2>
                <div className='expense-item__price'>{props.amount} €</div>
            </div>
        </div>
    );
};

export default ExpenseItem;
