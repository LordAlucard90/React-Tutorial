import './Expenses.css';
import Card from '../UI/Card';
import ExpenseItem from './ExpenseItem';

const Expenses = props => {
    return (
        <Card className='expenses'>
            {
                // <div className='expenses'>
            }
            {props.items.map(expense => {
                return (
                    <ExpenseItem
                        title={expense.title}
                        amount={expense.amount}
                        date={expense.date}
                    />
                );
            })}
            {
                // </div>
            }
        </Card>
    );
};

export default Expenses;
