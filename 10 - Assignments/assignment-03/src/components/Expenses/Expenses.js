import './Expenses.css';
import Card from '../UI/Card';
import ExpenseItem from './ExpenseItem';
import ExpensesFilter from './ExpensesFilter';
import { useState } from 'react';

const Expenses = props => {
    const [filterYear, setFilterYear] = useState('');
    const [visibleItems, setVisibleItems] = useState(props.items);

    const filterChangedHandler = year => {
        console.log('Expenses', year);
        setFilterYear(year);
        if (!!year) {
            const filteredExpenses = props.items.filter(expense => {
                return expense.date.getFullYear().toString() === year;
            });
            setVisibleItems(filteredExpenses);
        } else {
            setVisibleItems(props.items);
        }
    };

    return (
        <Card className='expenses'>
            <ExpensesFilter curYear={filterYear} onFilerChanged={filterChangedHandler} />
            {
                // <div className='expenses'>
            }
            {visibleItems.map(expense => {
                return (
                    <ExpenseItem
                        key={expense.id}
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
