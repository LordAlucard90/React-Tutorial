import './NewExpense.css';
import ExpenseForm from './ExpenseForm';
import { useState } from 'react';

const NewExpense = props => {
    const [showForm, setShowForm] = useState(false);

    const toggleShowForm = () => {
        setShowForm(prev => !prev);
    };

    const saveExpenseDataHandler = expenseData => {
        const expense = {
            ...expenseData,
            id: Math.random().toString(),
        };
        // console.log(expense);
        props.onAddExpense(expense);
    };
    return (
        <div className='new-expense'>
            {showForm ? (
                <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} onCancel={toggleShowForm} />
            ) : (
                <button onClick={toggleShowForm}>Add New Expense</button>
            )}
        </div>
    );
};

export default NewExpense;
