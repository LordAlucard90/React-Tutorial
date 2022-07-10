# Basics

## Content

- [Components](#components)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [JSX](#jsx)
- [Components Creation](#components-creation)
- [Props](#props)
- [Split Into Components](#split-into-components)
- [Files Structure](#files-structure)

---

## Components

React is a JavaScript library used to build user interfaces.
It is based on Components, a component is an interface element.
Using components allows to increase reusability and separation
of concerns.

A component is mainly built from html and JavaScript code,
can also added some css, but it is not he main focus.
Components are create with a declarative way, so it the React business
to figure it out which components should be showed and with which state.

## Setup

First must be installed [NodeJS](https://nodejs.org/en/).

A new create app can be created using the 
[create-react-app tool](https://create-react-app.dev/):
```bash
npx create-react-app <app_name>
cd <app_name>
npm start
```
the start command will redirect to a browser page at http://localhost:3000
where the default project is available.

## Project Structure

The project folder looks like:
```
├── node_modules
│   └── ...
├── package.json
├── package-lock.json
├── public
    ├── index.html
│   └── ...
├── README.md
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js
```
- **node_modules**: 
downloaded dependencies folder
- **package.json**:
project definition with name, scripts dependencies
- **src/index.js**:
contains the code that is showed in localhost (after a transformation)
- **public/index.html**:
is the single page used a react entry point using `<div id="root"></div>`
- **src/App.js**: 
contains the root component that wraps all the app

## JSX

Looking at the `App.js` content:
```javascript
import "./App.css";

function App() {
    return (
        <div>
            <h2>Hello World</h2>
        </div>
    );
}

export default App;
```
It is possible to see inside the return there is html like content
that is just a syntax sugar to allow to developer to easier write code
that will be automatically converted for the browser.

### createElement

In order to create the same Structure without the react syntactic sugar, 
the code would be:
```javascript
// not needed anymore
import React from 'react';
import './App.css';
import Expenses from './components/Expenses';

function App() {
    const expenses = [ /* ... */];
    // automatic transformation
    return React.createElement(
        'div',
        {},
        React.createElement('h2', {}, 'Hello World'),
        // Expenses will come later
        React.createElement(Expenses, { items: expenses }),
    );
}
```
`createElement` is the reasone because only one root element is necessary.

## Components Creation

Usually new components are created under sub-folders like `components/`.\
Components' file names are Usually named using the PacalCase.

A component in React is just a JavaScript function that returns the html code
that must be displayed in the screen.
The function name has Usually the same name as the component and 
it is exported as default at the bottom of the file.
```javascript
// both conventions are ok
// function ExpenseItem() {
const ExpenseItem = () => {
  return <h2>Expense Item</h2>;
}

export default ExpenseItem;
```
This component can then be included in the main app component:
```javascript
import ExpenseItem from "./components/ExpenseItem";

function App() {
  return (
    <div>
      <h2>Hello World</h2>
      { 
          // both these syntaxes can be used
      } 
      <ExpenseItem />
      <ExpenseItem></ExpenseItem>
    </div>
  );
}

export default App;
```

### JSX Structure

The html return by a component must have only one root:
```javascript
const ExpenseItem = () => {
  return (
    <div>
      <div>Date</div>
      <div>
        <h2>Title</h2>
        <div>Amount</div>
      </div>
    </div>
  );
};
```

### Styling

Styling is usually set in a css file with the same name as the component
and the file must be imported in the component to make React aware
of it so that it will be added to the build process:
```javascript
import './ExpenseItem.css'
```
to apply to the elements the css classes it is used the `className` keyword
instead of the `class` one, due to name collision:
```javascript
const ExpenseItem = () => {
  return (
    <div className="expense-item">
      <div>Date</div>
      <div className="expense-item__description">
        <h2>Title</h2>
        <div className="expense-item__price">Amount</div>
      </div>
    </div>
  );
};
```

### Dynamic Data

It is possible to set the content in the jsx by wrapping variables inside
curly braces:
```javascript
const ExpenseItem = () => {
    const expenseDate = new Date(2022, 2, 4);
    const expenseTitle = 'My Important expense';
    const expenseAmount = 42.24;

    return (
        <div className='expense-item'>
            <div>{expenseDate.toISOString()}</div>
            <div className='expense-item__description'>
                <h2>{expenseTitle}</h2>
                <div className='expense-item__price'>{expenseAmount} €</div>
            </div>
        </div>
    );
};
```

## Props

Using properties, it is possible to pass data from the app:
```javascript
function App() {
    const expenses = [
        {
            id: 'e1',
            title: 'Toilet Paper',
            amount: 94.12,
            date: new Date(2020, 7, 14),
        },
        // ...
    ];
    return (
        <div>
            <h2>Hello World</h2>
            {expenses.map(expense => {
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
}
```
to the component with the `props` parameter:
```javascript
const ExpenseItem = (props) => {
    const day = props.date.toLocaleString('en-US', { day: '2-digit' });
    const month = props.date.toLocaleString('en-US', { month: 'long' });
    const year = props.date.getFullYear();
    return (
        <div className='expense-item'>
            <div> 
                <div>{day}</div>
                <div>{month}</div>
                <div>{year}</div>
            </div>
            <div className='expense-item__description'>
                <h2>{props.title}</h2>
                <div className='expense-item__price'>{props.amount} €</div>
            </div>
        </div>
    );
};
```

## Split Into Components

Props allows to easily create new components to split logic across
multiple components:
```javascript
import ExpenseDate from './ExpenseDate';
import './ExpenseItem.css';

const ExpenseItem = props => {
    return (
        <div className='expense-item'>
            <ExpenseDate date={props.date} />
            <!-- ... -->
        </div>
    );
};
```
```javascript
const ExpenseDate = props => {
    const day = props.date.toLocaleString('en-US', { day: '2-digit' });
    const month = props.date.toLocaleString('en-US', { month: 'long' });
    const year = props.date.getFullYear();
    return (
        <div>
            <div>{day}</div>
            <div>{month}</div>
            <div>{year}</div>
        </div>
    );
};
```

### Children Components

It is possible to create a wrapper component, that will just be used
as a container to other components in order to add style, by passing the
reserved property `children`:
``javascript
const Card = props => {
    const classes = 'card ' + props.className;
    return <div className={classes}>{props.children}</div>;
};
``
then it can be used in this way:
```javascript
const Expenses = props => {
    return (
        <Card className='expenses'>
            // ...
        </Card>
    );
};

const ExpenseItem = props => {
    return (
        <Card className='expense-item'>
            // ...
        </Card>
    );
};
```

## Files Structure

Since a lot of files will be created, it is important to structure them in a 
good way.
There should be a folder for each context, for example a generic `UI/` one
and a more specific `Expenses/` one
```
components/
├── Expenses
│   ├── ExpenseDate.css
│   ├── ExpenseDate.js
│   ├── ExpenseItem.css
│   ├── ExpenseItem.js
│   ├── Expenses.css
│   └── Expenses.js
└── UI
    ├── Card.css
    └── Card.js
```

