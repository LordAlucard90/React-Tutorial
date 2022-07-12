# State And Events

## Content

- [Event Listening](#event-listening)
- [State](#state)
- [User Input](#user-input)
- [Move The State Around](#move-the-state-around)
- [Component Types](#component-types)

---

## Event Listening

It is possible to add listeners to the default html events using the `on` prefix
as JSX property, for example:
```javascript
const ExpenseItem = props => {
    const clickHandler = () => {
        console.log('Clicked!');
    };
    return (
        <Card className='expense-item'>
            // ...
            <button onClick={clickHandler}>Change Title</button>
        </Card>
    );
};
```

## State

By default, event if the content of a component changes programmatically,
what is displaied remains the same:
```javascript
    let title = props.title;
    const clickHandler = () => {
        console.log('Clicked!');
        title = "Changed!"
    };
    return (
        <Card className='expense-item'>
            // ...
                <h2>{title}</h2>
            // ...
        </Card>
    );
};

```
This is because React is not yet aware that something changed.

#### useState

To make React aware, it is necessary to use an hook called `useState`:
```javascript
const [title, setTitle] = useState(props.title);
const clickHandler = () => {
    setTitle('Changed!');
};
```
the use `useState` take the default value and returns the actual value and 
a function used to update the state. This function when called updates the
current value and triggers React to re-evaluate the UI.

The new value takes place only after the handler has been executed:
```javascript
const [title, setTitle] = useState(props.title);
const clickHandler = () => {
    setTitle('Changed!');
    console.log(title); // logs the old value
};
```


The `useState` hook:
- creates a state that is localized only in the current component, 
it does not affect other components
- only re-evaluate the current component when is updated
- at the first evaluation returns the default value, at the next ones, the 
user set values. It is then secure use `const` because the variable is
always recreated during the evaluation.

#### Multiple States

When multiple state are necessary in the same component, it is possible
to create individual ones:
```javascript
const [title, setTitle] = useState('');
const [date, setDate] = useState('');
const [amount, setAmount] = useState('');

const titleChangeHandler = event => {
    setTitle(event.target.value);
};
const amountChangeHandler = event => {
    setAmount(event.target.value);
};
const dateChangeHandler = event => {
    setDate(event.target.value);
};
```
or manage everything in just one:
```javascript
const [userInput, setUserInput] = useState({
    title: '',
    amount: '',
    date: '',
});

const titleChangeHandler = event => {
    setUserInput(prevState => {
        return {
            ...prevState,
            title: event.target.value,
        };
    });
};
const amountChangeHandler = event => {
    setUserInput(prevState => {
        return {
            ...prevState,
            amount: event.target.value,
        };
    });
};
const dateChangeHandler = event => {
    setUserInput(prevState => {
        return {
            ...prevState,
            date: event.target.value,
        };
    });
};
```
in this case the other values must be copied in order to do not lose them,
and since it depends on the previous one it is better to use the other syntax
in order to prevent edge-cases errors caused by the fact that React schedules
updates and does not update the state directly.

## User Input

It is possible to catch the user input using the  generic `onChange` property:
```javascript
const [title, setTitle] = useState('');
const [amount, setAmount] = useState('');
const [date, setDate] = useState('');

const titleChangeHandler = event => { setTitle(event.target.value); };
const amountChangeHandler = event => { setAmount(event.target.value); };
const dateChangeHandler = event => { setDate(event.target.value); };

return (
    <form>
        <div className='new-expense__controls'>
            <div className='new-expense__control'>
                <label>Title</label>
                <input type='text'  onChange={titleChangeHandler} />
            </div>
            <div className='new-expense__control'>
                <label>Amount</label>
                <input
                    type='number'
                    min='0.01'
                    step='0.01'
                    onChange={amountChangeHandler}
                />
            </div>
            <div className='new-expense__control'>
                <label>Date</label>
                <input
                    type='date'
                    min='2019-01-01'
                    max={today}
                    onChange={dateChangeHandler}
                />
            </div>
        </div>
        <div className='new-expense__actions'>
            <button type='submit'>Add</button>
        </div>
    </form>
);
```

#### Two-Way Binding

It is possible to create a two-way binding using the `value` property:
```javascript
// ...

return (
    <form onSubmit={submitHandler}>
        <div className='new-expense__controls'>
            <div className='new-expense__control'>
                <label>Title</label>
                <input
                    value={title}
                    // ...
                />
            </div>
            <div className='new-expense__control'>
                <label>Amount</label>
                <input
                    value={amount}
                    // ...
                />
            </div>
            <div className='new-expense__control'>
                <label>Date</label>
                <input
                    value={date}
                    // ...
                />
            </div>
        </div>
        <div className='new-expense__actions'>
            <button type='submit'>Add</button>
        </div>
    </form>
);
```

## Move The State Around

In order to move the input date from the ExpenseForm to NewExpense,
it is necessary to add a property event callback that is executed
when that data is submitted by the user:
```javascript
const ExpenseForm = props => {
    // ...
    const submitHandler = event => {
        // prevent the automatic page reload preformed on submit
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
            // ...
            <div className='new-expense__actions'>
                <button type='submit'>Add</button>
            </div>
        </form>
    );
};

const NewExpense = () => {
    const saveExpenseDataHandler = expenseData => {
        const expense = {
            ...expenseData,
            id: Math.random().toString(),
        };
        console.log(expense);
    };
    return (
        <div className='new-expense'>
            <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
        </div>
    );
};
```
then is possible to replicate the logic to forward the data from the NewExpense
to the App:
```javascript
const NewExpense = props => {
    const saveExpenseDataHandler = expenseData => {
        // ...
        props.onAddExpense(expense);
    };
    // ...
};

function App() {
    // ...
    const addExpenseHandler = expense => {
        console.log(expense);
    };

    return (
        <div>
            <NewExpense onAddExpense={addExpenseHandler} />
            // ...
        </div>
    );
}
```

## Component Types

The components can be divided into:
- Controlled / Uncontrolled
- Stateless / Stateful

A **Controlled** component is a component that does not manage its state,
but it only presents the UI and returns the data to the parent.
Example of that is the ExpenseFilter.

A **Stateless** or **Presentational** component is a component used only
for presenting the data, it has internal state.
Example of that is the ExpenseItem.

On the other side Expenses id a **Uncontrolled** and **Stateful** component,
because it will have its own filtering logic.

