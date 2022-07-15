# Fragments And Portals

## Content

- [JSX Limitations](#jsx-limitations)
- [Wrapper Components](#wrapper-bomponents)
- [Fragments](#fragments)
- [Portals](#portals)
- [Refs](#refs)

---

## JSX Limitations

By default JSX only allows one element to be returned in a component:
```javascript
return (
    <div>
        {error && (
            <ErrorModal
                title={error.title}
                message={error.message}
                onClose={dismissErrorHandler}
            />
        )}
        <Card className={styles.input}>
            <form onSubmit={addUserHandler}>
                <label htmlFor='username'>UserName</label>
                <input
                    id='username'
                    type='text'
                    onChange={userNameChangedHandler}
                    value={userName}
                />
                <label htmlFor='age'>Age (Year)</label>
                <input id='age' type='number' onChange={ageChangedHandler} value={age} />
                <Button type='submit'>Add User</Button>
            </form>
        </Card>
    </div>
);
```
But it is possible to solve this problem by returning a list of JSX elements
instead, but key on each element is needed:
```javascript
return [
    error && (
        <ErrorModal
            key='error-modal'
            title={error.title}
            message={error.message}
            onClose={dismissErrorHandler}
        />
    ),
    <Card className={styles.input}>
        <form onSubmit={addUserHandler}>
            <label htmlFor='username'>UserName</label>
            <input
                id='username'
                type='text'
                onChange={userNameChangedHandler}
                value={userName}
            />
            <label htmlFor='age'>Age (Year)</label>
            <input id='age' type='number' onChange={ageChangedHandler} value={age} />
            <Button type='submit'>Add User</Button>
        </form>
    </Card>,
];
```
but adding a root element in more easier, but in big projects can be not ideal
to render too many unnecessaty elemets.

## Wrapper Components

Another possiblility is to create a wrapper component that doesn't add any JSX:
```javascript
const Wrapper = props => {
    return props.children;
};
```
the usage is:
```javascript
return (
    <Wrapper>
        {error && (
            <ErrorModal
                title={error.title}
                message={error.message}
                onClose={dismissErrorHandler}
            />
        )}
        <Card className={styles.input}>
            <form onSubmit={addUserHandler}>
                <label htmlFor='username'>UserName</label>
                <input
                    id='username'
                    type='text'
                    onChange={userNameChangedHandler}
                    value={userName}
                />
                <label htmlFor='age'>Age (Year)</label>
                <input id='age' type='number' onChange={ageChangedHandler} value={age} />
                <Button type='submit'>Add User</Button>
            </form>
        </Card>
    </Wrapper>
);
```

## Fragments

Another possibility is to use fragments or, depending on the setup, empty
elements that in the end will act ad the wrapper component created berore but
are provided by React directly.
```javascript
return (
    <React.Fragment>
        <!-- ... -->
    </React.Fragment>
);

return (
    <>
        <!-- ... -->
    </>
);
```

## Portals

Semantically the portal rendered in this code:
```javascript
return (
    <Wrapper>
        {error && (
            <ErrorModal
                title={error.title}
                message={error.message}
                onClose={dismissErrorHandler}
            />
        )}
        <Card className={styles.input}>
            <form onSubmit={addUserHandler}>
                <label htmlFor='username'>UserName</label>
                <input
                    id='username'
                    type='text'
                    onChange={userNameChangedHandler}
                    value={userName}
                />
                <label htmlFor='age'>Age (Year)</label>
                <input id='age' type='number' onChange={ageChangedHandler} value={age} />
                <Button type='submit'>Add User</Button>
            </form>
        </Card>
    </Wrapper>
);
```
is not completely correct, because the modal should be place near the root,
because it goes at the top of everything else. This also applyes 
to side-bars, dialogs and so on.

Portals can be used to move this king of elements out out of the currnt context 
and place them in the right place.

#### Usage

To use portals it is necessary to create new containers
in the `public/index.html` file:
```html
<html lang="en">
  <head>
    <!-- ... -->
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="backdrop-root"></div>
    <div id="overlay-root"></div>
    <div id="root"></div>
  </body>
</html>
```
then the different modals can be split and rendered in the dom directly:
```javascript
import ReactDOM from 'react-dom';
// ...

const Backdrop = props => {
    return <div className={styles.backdrop} onClick={props.onClose}></div>;
};

const ModalOverlay = props => {
    return (
        <Card className={styles.modal}>
            <header className={styles.header}>
                <h2>{props.title}</h2>
            </header>
            <div className={styles.content}>
                <p>{props.message}</p>
            </div>
            <footer className={styles.actions}>
                <Button onClick={props.onClose}>Close</Button>
            </footer>
        </Card>
    );
};

const ErrorModal = props => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop onClose={props.onClose} />,
                document.getElementById('backdrop-root'),
            )}
            {ReactDOM.createPortal(
                // other valid syntax, but ALL the props are forwarded..
                // <ModalOverlay {...props} />,
                <ModalOverlay
                    title={props.title}
                    message={props.message}
                    onClose={props.onClose}
                />,
                document.getElementById('overlay-root'),
            )}
        </>
    );
};
```

## Refs

Ref[erences] are used to bind JSX element from which id then possible to namege
the value without using the two way binding that can be more computationally
expensive:
```javascript
const AddUser = props => {
    // const [userName, setUserName] = useState('');
    // const [age, setAge] = useState('');
    // ...
    const nameRef = useRef();
    const ageRef = useRef();

    const addUserHandler = event => {
        // ...
        const curName = nameRef.current.value;
        const curAge = ageRef.current.value;
        // if (userName.trim().length === 0 || age.trim().length === 0) {
        if (curName.length === 0 || curAge.length === 0) {
            // ...
        }
        // if (+age < 1) {
        if (+curAge < 1) {
            // ...
        }
        // props.onAddUser(userName, age);
        props.onAddUser(curName, curAge);
        // setUserName('');
        // setAge('');
        nameRef.current.value = '';
        ageRef.current.value = '';
    };

    // const userNameChangedHandler = event => {
    //     setUserName(event.target.value);
    // };

    // const ageChangedHandler = event => {
    //     setAge(event.target.value);
    // };

    // ...

    return (
        <Wrapper>
            {error && (
                <ErrorModal
                    title={error.title}
                    message={error.message}
                    onClose={dismissErrorHandler}
                />
            )}
            <Card className={styles.input}>
                <form onSubmit={addUserHandler}>
                    <label htmlFor='username'>UserName</label>
                    <input 
                        id='username'
                        type='text'
                        // onChange={userNameChangedHandler}
                        // value={userName}
                        ref={nameRef}
                        />
                    <label htmlFor='age'>Age (Year)</label>
                    <input
                        id='age'
                        type='number'
                        // onChange={ageChangedHandler}
                        // value={age}
                        ref={ageRef}
                        />
                    <Button type='submit'>Add User</Button>
                </form>
            </Card>
        </Wrapper>
    );
};
```
Refs are better to be used only to read and not to change the DOM.

The components that uses refs are called uncontrolled components, becose
their internal state is not controlled by React directly.

