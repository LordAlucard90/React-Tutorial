import './Expenses.css';
import ExpenseItem from './ExpenseItem';

const Expenses = props => {
    return (
        <div className='expenses'>
            {props.items.map(expense => {
                return (
                    <ExpenseItem
                        title={expense.title}
                        amount={expense.amount}
                        date={expense.date}
                    />
                );
            })}
        </div>
    );
};

export default Expenses;
