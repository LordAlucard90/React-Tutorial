import './Expenses.css';
import Card from '../UI/Card';
// import ExpenseItem from './ExpenseItem';
import ExpensesFilter from './ExpensesFilter';
import ExpensesList from './ExpensesList';
import ExpensesChart from './ExpenseChart';
import { useState } from 'react';

const Expenses = props => {
    const [filterYear, setFilterYear] = useState('');
    const filterChangedHandler = year => {
        // console.log('Expenses', year);
        setFilterYear(year);
    };

    const filteredItems = props.items.filter(expense => {
        return !filterYear || expense.date.getFullYear().toString() === filterYear;
    });

    // let expensesContent = <p>No expenses found.</p>;
    //
    // if (filteredItems.length > 0) {
    //     expensesContent = filteredItems.map(expense => {
    //         return (
    //             <ExpenseItem
    //                 key={expense.id}
    //                 title={expense.title}
    //                 amount={expense.amount}
    //                 date={expense.date}
    //             />
    //         );
    //     });
    // }

    return (
        <li>
            <Card className='expenses'>
                <ExpensesFilter curYear={filterYear} onFilerChanged={filterChangedHandler} />
                {
                    // <div className='expenses'>
                    // expensesContent
                }
                <ExpensesChart expenses={filteredItems} />
                <ExpensesList items={filteredItems} />
                {
                    // props.items.map(expense => {
                    //     return (
                    //         <ExpenseItem
                    //             key={expense.id}
                    //             title={expense.title}
                    //             amount={expense.amount}
                    //             date={expense.date}
                    //         />
                    //     );
                    // })
                }
                {
                    // </div>
                }
            </Card>
        </li>
    );
};

export default Expenses;
