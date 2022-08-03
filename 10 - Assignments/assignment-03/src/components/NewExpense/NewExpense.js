import './NewExpense.css';
import ExpenseForm from './ExpenseForm';

const NewExpense = props => {
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
            <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
        </div>
    );
};

export default NewExpense;
