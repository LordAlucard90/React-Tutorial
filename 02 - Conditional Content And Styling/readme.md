# Conditional Content And Styling

## Content

- [Rendering Lists](#rendering-lists)
- [Conditional Content](#conditional-content)
- [Dynamic Styling](#dynamic-styling)
- [Styled Components](#styled-components)
- [CSS Modules](#css-modules)

---

## Rendering Lists

It is possible to render a list of expenses using the map method on the 
expenses array inside the Expenses to generate an JSX element for each item:
```javascript
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
```
It is necessary to use the **key** property in order to allow React 
to distinguish each element and optimize the re-rendering.

In the app can be managed the expenses as a state in this way:
```javascript
const INITIAL_EXPENSES = [ /* ... */ ]

function App() {
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

    const addExpenseHandler = expense => {
        setExpenses(prev => [...prev, expense]);
    };

    return (
        <div>
            <NewExpense onAddExpense={addExpenseHandler} />
            <Expenses items={expenses} />
        </div>
    );
}
```

## Conditional Content

It is possible to filter the expenses depending on the filter and display
an optional message if no items are available in this way:
```javascript
const Expenses = props => {
    const [filterYear, setFilterYear] = useState('');
    const filterChangedHandler = year => {
        setFilterYear(year);
    };

    const filteredItems = props.items.filter(expense => {
        return !filterYear || expense.date.getFullYear().toString() === filterYear;
    });

    return (
        <Card className='expenses'>
            <ExpensesFilter curYear={filterYear} onFilerChanged={filterChangedHandler} />
            {filteredItems.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
                filteredItems.map(expense => {
                    return (
                        <ExpenseItem
                            key={expense.id}
                            title={expense.title}
                            amount={expense.amount}
                            date={expense.date}
                        />
                    );
                })
            )}
        </Card>
    );
};
```
A more readable way to achieve the same output is:
```javascript
{filteredItems.length === 0 && <p>No expenses found.</p>}
{filteredItems.length > 0 &&
    filteredItems.map(expense => {
        return (
            <ExpenseItem
                key={expense.id}
                title={expense.title}
                amount={expense.amount}
                date={expense.date}
            />
        );
    })}
```
Alternatively it is also possible to use a variable with a default:
```javascript
let expensesContent = <p>No expenses found.</p>;

if (filteredItems.length > 0) {
    expensesContent = filteredItems.map(expense => {
        return (
            <ExpenseItem
                key={expense.id}
                title={expense.title}
                amount={expense.amount}
                date={expense.date}
            />
        );
    });
}
return (
    <Card className='expenses'>
        <ExpensesFilter curYear={filterYear} onFilerChanged={filterChangedHandler} />
        {expensesContent}
    </Card>
);
```

The approaches above are valid if ony a piece of the content changes, 
if all the content changes can be used this second approach:
```javascript
const ExpensesList = props => {
    if (props.items.length === 0) {
        return <h2 className='expenses-list__fallback'>No expenses found.</h2>;
    }

    return (
        <ul className='expenses-list'>
            {filteredItems.map(expense => {
                return (
                    <ExpenseItem
                        key={expense.id}
                        title={expense.title}
                        amount={expense.amount}
                        date={expense.date}
                    />
                );
            })}
        </ul>
    );
};
```

## Dynamic Styling

#### Inline Style

It is possible to dynamically set the style of a component using inline style:
```javascript
const ChartBar = props => {
    let barHeight = '0%';

    if (props.max > 0) {
        barHeight = Math.round((props.value / props.max) * 100) + '%';
    }
    return (
        <div className='chart-bar'>
            <div className='chart-bar__inner'>
                <div className='chart-bar__fill' style={{ height: barHeight }}></div>
            </div>
            <div className='chart-bar__label'>{props.label}</div>
        </div>
    );
};
```

#### Class Style

Given a css error style:
```css
.form-control.invalid input {
    border-color: red;
    background: #ffd7d7;
}

.form-control.invalid label {
    border-color: red;
}
```
it is possible to dynamically set the error class on the element in this way:
```javascript
<div className={`form-control ${!isValid ? 'invalid': ''}`}>
    <!-- ... -->
</div>
```

## Styled Components

By default the css imported in react in this way is applied blobally.

[Styled Components](https://styled-components.com/) is a package that helps
to create components with style only attached to them.\
To install is can be run:
```bash
npm i styled-components
```

#### Element Creation

It is possible to create a custom styled html element using:
```javascript
import styled from 'styled-components';

const Element = styled.<element>`<style>`
```
where element is any available html element.\
Inside the `\`` then goes the css style that must apply only to this object.\
The returned `Element` is a special component and all the properties 
belonging to the same normale one can be used.

For a button can be:
```javascript
const Button = styled.button`
    font: inherit;
    padding: 0.5rem 1.5rem;
    border: 1px solid #8b005d;
    color: white;
    background: #8b005d;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
    cursor: pointer;

    &:focus {
        outline: none;
    }

    &:hover,
    &:active {
        background: #ac0e77;
        border-color: #ac0e77;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
    }
`;
```
it is not necessary to use the `.button` selector and when needed can be used `&`.

This approach will generate unique css classes, therefore no other components
will be affected.

#### Dynamic Style

Since this king of component forward its propes, it is possible to
define the class name like this:
```javascript
const FormControl = styled.div`
    margin: 0.5rem 0;

    & label {
        font-weight: bold;
        display: block;
        margin-bottom: 0.5rem;
    }

    & input {
        display: block;
        width: 100%;
        border: 1px solid #ccc;
        font: inherit;
        line-height: 1.5rem;
        padding: 0 0.25rem;
    }

    & input:focus {
        outline: none;
        background: #fad0ec;
        border-color: #8b005d;
    }

    &.invalid input {
        border-color: red;
        background: #ffd7d7;
    }

    &.invalid label {
        color: red;
    }
`;

const CourseInput = props => {
    // ...

    return (
        <form onSubmit={formSubmitHandler}>
            <FormControl className={!isValid && 'invalid'}>
                // ...
            </FormControl>
            <Button type='submit'>Add Goal</Button>
        </form>
    );
};
```
or define dynamic properties:
```javascript
const FormControl = styled.div`
    margin: 0.5rem 0;

    & label {
        font-weight: bold;
        display: block;
        margin-bottom: 0.5rem;
        color: {props => props.invalid ? 'red' : 'black'};
    }

    & input {
        display: block;
        width: 100%;
        border: 1px solid {props => props.invalid ? 'red' : '#ccc'};
        background: {props => props.invalid ? '#ffd7d7' : 'transparent'};
        font: inherit;
        line-height: 1.5rem;
        padding: 0 0.25rem;
    }

    & input:focus {
        outline: none;
        background: #fad0ec;
        border-color: #8b005d;
    }

    // not needed anymore
    // &.invalid input {
    //     border-color: red;
    //     background: #ffd7d7;
    // }
    //
    // &.invalid label {
    //     color: red;
    // }
`;

const CourseInput = props => {
    // ...

    return (
        <form onSubmit={formSubmitHandler}>
            <FormControl invalid={!isValid}>
                // ...
            </FormControl>
            <Button type='submit'>Add Goal</Button>
        </form>
    );
};

export default CourseInput;
```

#### Media Queries

Media queries can be easily integrated in this way:
```javascript
const Button = styled.button`
    width: 100%;
    // ...

    @media (min-width: 768px) {
        width: auto;
    }

    // ...
`;
```

## CSS Modules

[CSS Modules](https://github.com/css-modules/css-modules) can only be supported
on project set up for them. In React there is the 
[css-modules support](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/).

In order to make the CSS modules work it is necessary to rename the `.css`
file to `.module.css` then it is necessary to import the file as a `style`:
```javascript
import styles from './Button.module.css';
```
this allows to use the css classes defined in that files as properties:
```javascript
const Button = props => {
  return (
    <button type={props.type} className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
```
in the resultant css file will be generated unique stile classes automatically.

#### Dynamic Styles

It is possible to apply dynamic styles with css modules in this way:
```javascript
import styles from './CourseInput.module.css';

const CourseInput = props => {
    // ...

    return (
        <form onSubmit={formSubmitHandler}>
            <div className={`${styles['form-control']} ${!isValid && styles.invalid}`}>
                // ...
            </div>
            <Button type='submit'>Add Goal</Button>
        </form>
    );
};
```

#### Media Queries

To use media queries it is enough to se the in the css module file:
```css
.button {
    width: 100%;
    // ...
}

// ...

@media (min-width: 768px) {
    .button {
        width: auto;
    }
}
```



















