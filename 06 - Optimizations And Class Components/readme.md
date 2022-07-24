# Optimizations And Class Components

## content

- [Components Evaluation](#components-evaluation)
- [Prevent Re-evaluation](#prevent-re-evaluation)
- [useCallback](#usecallback)
- [State Updates And Scheduling](#state-updates-and-scheduling)
- [useMemo](#usememo)
- [Class Components](#class-components)
- [Error Boundaries](#error-boundaries)

---

## Components Evaluation

React only re-evaluate a component if state, props or context change.\

#### Current Component Update

Given:
```javascript
function App() {
    const [showParagraph, setShowParagraph] = useState(false);

    console.log('App running!');

    const toggleParagraphHandler = () => {
        setShowParagraph(cur => !cur);
    };
    return (
        <div className='app'>
            <h1>Hi there!</h1>
            {showParagraph && <p>This is New</p>}
            <Button onClick={toggleParagraphHandler}>Show Paragraph!</Button>
        </div>
    );
}
```
the console log message is logged every time the button is clicked.
But on the DOM the only element to change is the paragraph.

#### Child Component Update

Given:
```javascript
function App() {
    const [showParagraph, setShowParagraph] = useState(false);

    console.log('App running!');

    const toggleParagraphHandler = () => {
        setShowParagraph(cur => !cur);
    };
    return (
        <div className='app'>
            <h1>Hi there!</h1>
            <DemoOutput show={showParagraph} />
            <Button onClick={toggleParagraphHandler}>Show Paragraph!</Button>
        </div>
    );
}

const DemoOutput = props => {
    console.log('DemoOutput running!');
    return <p>{props.show ? 'This is New' : ''}</p>;
};
```
also in this case the messages are logged on every button press and only the 
paragraph is updated in the DOM.

If the DemoOutput state is detached from the App one:
```javascript
<DemoOutput show={false} />
```
will be visible the "DemoOutput running!" log, because the re-evaluate of the
App triggers the re-evaluation of the children because JSX is in the end
just functions calls. This applies also for all the children components.\
But for the DOM prospective no changes are visible.

## Prevent Re-evaluation

It is possible to use `React.memo` to tell React to analyse if the properties
passed to the component changed and if not then do not render them:
```javascript
const DemoOutput = props => {
    // ...
};

export default React.memo(DemoOutput);
```
In this case using 
```javascript
<DemoOutput show={false} />
```
the log "DemoOutput running!" is not displayed because the component is not 
re-evaluated.\
Also this has a cost and depending on the component where it is applyed
can have sense or not.
On the top level can hace sense to avoid a big amount of children.
But if the component usually changes a lot the check of the props
is a lot of work for nothing.

If the memo function is used on the Button:
```javascript
const Button = props => {
    console.log('Button running!');
    return (
        // ...
    );
};

export default React.memo(Button);
```
the "Button running!" will be evaluated on each App rerender because,
even if the data passed seans to be static:
````javascript
function App() {
    const [showParagraph, setShowParagraph] = useState(false);

    console.log('App running!');

    const toggleParagraphHandler = () => {
        setShowParagraph(cur => !cur);
    };
    return (
        <div className='app'>
            <h1>Hi there!</h1>
            <DemoOutput show={false} />
            <Button onClick={toggleParagraphHandler}>Show Paragraph!</Button>
        </div>
    );
}
````
the `toggleParagraphHandler` is actually recreated every time, therefore
it is like a new value and this leads to a re-evaluation.\
The same happens with the `false`, but since it is a primitive type the 
equality check returns true, while the equality check for the function,
that is an object, fails.

## useCallback

In order to do no recreate the handler every time it is possible to use
the `useCallback` hook that allows to store the same methos reference
and recreate it only if some dependencies change (like `useEffect`):
```javascript
function App() {
    const [showParagraph, setShowParagraph] = useState(false);

    console.log('App running!');

    const toggleParagraphHandler = useCallback(() => {
        setShowParagraph(cur => !cur);
    }, []);

    return (
        <div className='app'>
            <h1>Hi there!</h1>
            <DemoOutput show={false} />
            <Button onClick={toggleParagraphHandler}>Show Paragraph!</Button>
        </div>
    );
}
```
in this way the button is not re-evaluated.

An example of why dependencies are used in the context of a function is:
```javascript
function App() {
    const [showParagraph, setShowParagraph] = useState(false);
    const [allowToggle, setAllowToggle] = useState(false);

    console.log('App running!');

    const allowToggleHandler = useCallback(() => {
        setAllowToggle(true);
    }, []);

    const toggleParagraphHandler = useCallback(() => {
        if (allowToggle) {
            setShowParagraph(cur => !cur);
        }
    }, [allowToggle]);

    return (
        <div className='app'>
            <h1>Hi there!</h1>
            <DemoOutput show={showParagraph} />
            <Button onClick={allowToggleHandler}>Allow Toggle</Button>
            <Button onClick={toggleParagraphHandler}>Show Paragraph!</Button>
        </div>
    );
}
```

Functions form closures, this means that when a function is created it is 
actually a combination of a function and a lexical environment within the 
function were created. This means that all the needed scope variable
are taken in.
In the case of
```javascript
const toggleParagraphHandler = useCallback(() => {
    if (allowToggle) {
        setShowParagraph(cur => !cur);
    }
}, [allowToggle]);
```
`allowToggle` is part of the function at its creation, and if it is removed
from the dependencies' list a warning in the IDE should be generated.

[Closure Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

## State Updates And Scheduling

When the `setState` of the `useState` hook is used, the new variable is not 
immediately updated but the change is scheduled.\
Usually the change is very fast and the used dows not notice the cange,
but when a lot of changes are going on at the same time some can have 
the priority on others, for example use input management has bigges priority
as some text.\
React guarantees that the changes on the same component are managed in order,
but not the changes across multiple components.\
Therefore every time the new state depends in some way from the previous one,
it must be used the `setState(prev => cur)` syntax.\

Use effect guarantees that it is run every time on the its dependencies change,
in this case it is safe to refer to the state directly and not the the previous
one.

When multiple state are updated in the same function, all the changes are
batched at the same time, not scheduled separately for Optimization reasons.

## useMemo

`useMemo` has the same scope as `useCallback` does for function,
it stores some (computed) value and does not recalculats it as far as
its dependencies do not change:
```javascript
const sorted = useMemo(() -> {
    return props.items.sort((a, b) => a - b);
}, [props.items]);
```
If there are constant, can be managed in this way:
```javascript
const list = useMemo(() => [1,5,4], []);
```

## Class Components

Class components were the old way to build components, but now thanks to hooks
it is not anymore necessary to use them as before.

#### Basic and Props

In order to migrate a simple functional component to a class one
```javascript
const User = props => {
    return <li className={classes.user}>{props.name}</li>;
};
```
it is necessaty to create a class that extends the `Component` base one:
```javascript
import { Component } from 'react';

class User extends Component {
    render() {
        return <li className={classes.user}>{this.props.name}</li>;
    }
}
```
the `render()` methods is used to return the JSX and the `props` are accessible
using the `this` reference, this is possible thanks to the base class.

#### State And Events

State and method helpers are migrated froma functional component like:
```javascript
const Users = () => {
    const [showUsers, setShowUsers] = useState(true);

    const toggleUsersHandler = () => {
        setShowUsers(curState => !curState);
    };

    const usersList = (
        <ul>
            {DUMMY_USERS.map(user => (
                <User key={user.id} name={user.name} />
            ))}
        </ul>
    );

    return (
        <div className={classes.users}>
            <button onClick={toggleUsersHandler}>{showUsers ? 'Hide' : 'Show'} Users</button>
            {showUsers && usersList}
        </div>
    );
};
```
to a clasa based ones in this way:
```javascript
class Users extends Component {
    constructor() {
        super();
        // the state field must always be called state and must be an object
        this.state = {
            showUsers: true,
            anotherState: '...'
        };
    }

    // helpers are just class methods
    toggleUsersHandler = () => {
        // the state is not overridden but merged
        // this.setState({newStateMerged: '...'});
        // current state can be retrieved also in this case
        this.setState(curState => {
            return { showUsers: !curState.showUsers };
        });
    };

    render() {
        const usersList = (
            <ul>
                {DUMMY_USERS.map(user => (
                    <User key={user.id} name={user.name} />
                ))}
            </ul>
        );

        return (
            <div className={classes.users}>
                // in order to correctly refer to the this context in the helper
                // the bind methos is necessaty
                <button onClick={this.toggleUsersHandler.bind(this)}>
                    {this.state.showUsers ? 'Hide' : 'Show'} Users
                </button>
                {this.state.showUsers && usersList}
            </div>
        );
    }
}
```

#### Life-Cycles

The class based components do not have the `useEffect` hook, but they use:
- `componentDidMount()`\
equivalent to `useEffect` with no dependencies `useEffect(/* ... */, [])`
- `componentDidUpdate()`\
equivalent to `useEffect` with dependencies `useEffect(/* ... */, [dependency])`
- `componentWillUnmount()`\
equivalent to `useEffect` with a return cleanUp function
`useEffect(() => { return () => {/* ... */}}, [/* ... */])`
- other less important

Given the functional component:
```javascript
const UserFinder = () => {
    const [filteredUsers, setFilteredUsers] = useState(DUMMY_USERS);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilteredUsers(DUMMY_USERS.filter(user => user.name.includes(searchTerm)));
    }, [searchTerm]);

    const searchChangeHandler = event => {
        setSearchTerm(event.target.value);
    };

    return (
        <Fragment>
            <div className={styles.finder}>
                <input type='search' onChange={searchChangeHandler} />
            </div>
            <Users users={filteredUsers} />
        </Fragment>
    );
};
```
the class version with the mount and update life-cycles is:
```javascript
class UserFinder extends Component {
    constructor() {
        super();
        this.state = {
            filteredUsers: [],
            searchTerm: '',
        };
    }

    // only run the first time the component is rendered
    componentDidMount() {
        // send a request to a server...
        this.setState({ filteredUsers: DUMMY_USERS });
    }

    // run on every change of props and state
    componentDidUpdate(prevProps, prevState) {
        // avoid infinite loop
        if (prevState.searchTerm !== this.state.searchTerm) {
            this.setState({
                filteredUsers: DUMMY_USERS.filter(user =>
                    user.name.includes(this.state.searchTerm),
                ),
            });
        }
    }

    searchChangeHandler = event => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        return (
            <Fragment>
                <div className={styles.finder}>
                    <input type='search' onChange={this.searchChangeHandler.bind(this)} />
                </div>
                <Users users={this.state.filteredUsers} />
            </Fragment>
        );
    }
}
```
an example of unmount is:
```javascript
class User extends Component {
    componentWillUnmount() {
        console.log("Users willUnmount")
    }

    render() {
        return <li className={classes.user}>{this.props.name}</li>;
    }
}
```

#### Context

The context definition and the providing remain the same:
```javascript
const UserContext = React.createContext({
    users: [],
});

function App() {
    const userContext = {
        users: DUMMY_USERS,
    };

    return (
        <div>
            <UserContext.Provider value={userContext}>
                <UserFinder />
            </UserContext.Provider>
        </div>
    );
}
```
To retrieve the context, it is possible to use the 
`<UserContext.Consumer> </UserContext.Consumer>`, or:
```javascript
class UserFinder extends Component {
    static contextType = UserContext;

    // ...

    componentDidMount() {
        // this.setState({ filteredUsers: DUMMY_USERS });
        this.setState({ filteredUsers: this.context.users });
    }

    // ...
}
```
unfortunately a class component can only manage one context type.

## Error Boundaries

Some types of errors, like offline servers and so on, cannot be prevented.
```javascript
class Users extends Component {
    // ...

    componentDidUpdate() {
        if (this.props.users.length === 0) {
            throw new Error('No users provided!');
        }
    }

    // ...
}
```
No all the code can be managed with a `try-catch` to correctly handle it
can be created an error boundary:
```javascript
class ErrorBoundary extends Component {
    constructor() {
        super();
        this.state = { hasError: false };
    }

    // is called whenever a child component throws an error
    componentDidCatch(error) {
        console.log(error);
        this.setState({ hasError: true });
    }

    render() {
        // alternative logic in case of error
        if (this.state.hasError) {
            return <p>Something went wrong!</p>;
        }

        // it is used to surround other components
        return this.props.children;
    }
}
```
and used in other componenes in this way:
```javascript
return (
    // ...
    <ErrorBoundary>
        <Users users={this.state.filteredUsers} />
    </ErrorBoundary>
    // ...
```

