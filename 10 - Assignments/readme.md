# Assignments

## Content

Basics
- [Assignment 01](#assignment-01)
State And Events:
- [Assignment 02](#assignment-02)
Conditional Content And Styling
- [Assignment 03](#assignment-03)
- [Assignment 04](#assignment-04)
Forms
- [Assignment 05](#assignment-05)

---

## Assignment 01

Add an `Expenses` component that holds all the expenses.

#### Solution

Expenses component:
```javascript
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
```
App component:
```javascript
function App() {
    const expenses = [
        { id: 'e1', title: 'Toilet Paper', amount: 94.12, date: new Date(2020, 7, 14), },
        { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2021, 2, 12) },
        { id: 'e3', title: 'Car Insurance', amount: 294.67, date: new Date(2021, 2, 28), },
        { id: 'e4', title: 'New Desk (Wooden)', amount: 450, date: new Date(2021, 5, 12), },
    ];
    return (
        <div>
            <h2>Hello World</h2>
            <Expenses items={expenses} />
        </div>
    );
}
```

## Assignment 02

Given the new ExpensesFilter component, listen to the state changes and
move it to the Expenses component.

#### Solution

ExpensesFilter:
```javascript
const ExpensesFilter = props => {
    let optionYears = [];
    for (let year = +new Date().getFullYear(); year >= 2019; year--) {
        optionYears.push(year);
    }

    const filterSelectedHandler = event => {
        props.onFilerChanged(event.target.value)
    };

    return (
        <div className='expenses-filter'>
            <div className='expenses-filter__control'>
                <label>Filter by year</label>
                <select value={props.curYear} onChange={filterSelectedHandler}>
                    <option value=''>-</option>
                    {optionYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
```
Expenses:
```javascript
const Expenses = props => {
    const [filterYear, setFilterYear] = useState('');
    const filterChangedHandler = year => {
        console.log('Expenses', year);
        setFilterYear(year)
    };

    return (
        <Card className='expenses'>
            <ExpensesFilter curYear={filterYear} onFilerChanged={filterChangedHandler} />
            {props.items.map(expense => {
                return (
                    <ExpenseItem
                        key={expense.id}
                        title={expense.title}
                        amount={expense.amount}
                        date={expense.date}
                    />
                );
            })}
        </Card>
    );
};
```

## Assignment 03

Make the year filter work.

#### Solution

Expenses:
```javascript
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
        </Card>
    );
};
```

## Assignment 04

Substitute the create expense content with a button that, if clicked, 
shows the insert expense form.\
Add a second button to make the form disappear and return to the initial state.

#### Solution

NewExpense:
```javascript
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
```

ExpenseForm:
```javascript
const ExpenseForm = props => {
    const now = new Date();
    const today = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${now.getDate()}`;

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    const titleChangeHandler = event => {
        setTitle(event.target.value);
    };
    const amountChangeHandler = event => {
        setAmount(event.target.value);
    };
    const dateChangeHandler = event => {
        setDate(event.target.value);
    };

    const submitHandler = event => {
        event.preventDefault();
        const expense = {
            title: title,
            amount: amount,
            date: new Date(date),
        };

        props.onSaveExpenseData(expense);
        setTitle('');
        setAmount('');
        setDate('');
    };

    return (
        <form onSubmit={submitHandler}>
            <div className='new-expense__controls'>
                <div className='new-expense__control'>
                    <label>Title</label>
                    <input type='text' value={title} onChange={titleChangeHandler} />
                </div>
                <div className='new-expense__control'>
                    <label>Amount</label>
                    <input
                        type='number'
                        min='0.01'
                        step='0.01'
                        value={amount}
                        onChange={amountChangeHandler}
                    />
                </div>
                <div className='new-expense__control'>
                    <label>Date</label>
                    <input
                        type='date'
                        min='2019-01-01'
                        max={today}
                        value={date}
                        onChange={dateChangeHandler}
                    />
                </div>
            </div>
            <div className='new-expense__actions'>
                <button onClick={props.onCancel} type='button'>Cancel</button>
                <button type='submit'>Add</button>
            </div>
        </form>
    );
};
```

## Assignment 05

Create a second input for email and ensure the form is valid only if both
inputs are valid.

#### Solution

```javascript
const SimpleInput = props => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isNameTouched, setIsNameTouched] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);

    const isNameValid = name !== '';
    const nameInputIsInvalid = !isNameValid && isNameTouched;
    const isEmailValid = email !== '' && email.match(/[0-9a-zA-Z.]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]{2,3}/);
    const emailInputIsInvalid = !isEmailValid && isEmailTouched;
    const isFromValid = isNameValid && isEmailValid; // && other inputs

    const nameChangedHandler = event => {
        setName(event.target.value);
    };

    const nameBlurHandler = event => {
        setIsNameTouched(true);
    };

    const emailChangedHandler = event => {
        setEmail(event.target.value);
    };

    const emailBlurHandler = event => {
        setIsEmailTouched(true);
    };

    const formSubmitHandler = event => {
        event.preventDefault();

        // all input are considered touched on submit
        setIsNameTouched(true);
        setIsEmailTouched(true);

        if (!isFromValid) {
            return;
        }

        console.log(name, email);
        setName('');
        setIsNameTouched(false);
        setEmail('');
        setIsEmailTouched(false);
    };

    const nameInputClasses = !nameInputIsInvalid ? 'form-control' : 'form-control invalid';
    const emailInputClasses = !emailInputIsInvalid ? 'form-control' : 'form-control invalid';

    return (
        <form onSubmit={formSubmitHandler}>
            <div className={nameInputClasses}>
                <label htmlFor='name'>Your Name</label>
                <input
                    value={name}
                    type='email'
                    id='name'
                    onChange={nameChangedHandler}
                    onBlur={nameBlurHandler}
                />
                {nameInputIsInvalid && <p className='error-text'>Name must be not empty.</p>}
            </div>
            <div className={emailInputClasses}>
                <label htmlFor='email'>Your Email</label>
                <input
                    value={email}
                    type='text'
                    id='email'
                    onChange={emailChangedHandler}
                    onBlur={emailBlurHandler}
                />
                {emailInputIsInvalid && <p className='error-text'>Must be a valid email.</p>}
            </div>
            <div className='form-actions'>
                <button disabled={!isFromValid}>Submit</button>
            </div>
        </form>
    );
};
```

