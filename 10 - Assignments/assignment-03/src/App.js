// import React from 'react';
import { useState } from 'react';
import './App.css';
import Expenses from './components/Expenses/Expenses';
import NewExpense from './components/NewExpense/NewExpense';

const INITIAL_EXPENSES = [
    {
        id: 'e1',
        title: 'Toilet Paper',
        amount: 94.12,
        date: new Date(2020, 7, 14),
    },
    { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2021, 2, 12) },
    {
        id: 'e3',
        title: 'Car Insurance',
        amount: 294.67,
        date: new Date(2021, 2, 28),
    },
    {
        id: 'e4',
        title: 'New Desk (Wooden)',
        amount: 450,
        date: new Date(2021, 5, 12),
    },
];

function App() {
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

    const addExpenseHandler = expense => {
        // console.log(expense);
        setExpenses(prev => [expense, ...prev]);
    };
    // without syntactic sugar
    // return React.createElement(
    //     'div',
    //     {},
    //     React.createElement('h2', {}, 'Hello World'),
    //     React.createElement(Expenses, { items: expenses }),
    // );

    return (
        <div>
            {
                // <h2>Hello World</h2>
            }
            <NewExpense onAddExpense={addExpenseHandler} />
            {
                // both these syntaxes can be used
                // <ExpenseItem />
                // <ExpenseItem></ExpenseItem>
                // <ExpenseItem
                //     title={expenses[0].title}
                //     amount={expenses[0].amount}
                //     date={expenses[0].date}></ExpenseItem>
            }
            {
                // expenses.map(expense => {
                //     return (
                //         <ExpenseItem
                //             title={expense.title}
                //             amount={expense.amount}
                //             date={expense.date}
                //         />
                //     );
                // })
            }
            <Expenses items={expenses} />
        </div>
    );
}

export default App;
