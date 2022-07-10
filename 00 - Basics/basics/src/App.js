// import React from 'react';
import './App.css';
import Expenses from './components/Expenses/Expenses';

function App() {
    const expenses = [
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

    // without syntactic sugar
    // return React.createElement(
    //     'div',
    //     {},
    //     React.createElement('h2', {}, 'Hello World'),
    //     React.createElement(Expenses, { items: expenses }),
    // );

    return (
        <div>
            <h2>Hello World</h2>
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
