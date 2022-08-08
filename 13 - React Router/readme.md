# React Router

## Content

- [Setup](#setup)
- [Routes](#routes)
- [Navigation](#navigation)
- [Route Parameters](#route-parameters)
- [Nested Routes](#nested-routes)
- [User Redirection](#user-redirection)
- [Programmatic Navigation](#programmatic-navigation)
- [Prevent Navigation](#prevent-navigation)
- [Query Parameters](#query-parameters)
- [REST API](#rest-api)
- [React Router 6](#react-router-6)

---

## Setup

In order to install the React Router to create a single page application,
it must be run:
```bash
# the migration to version 6 will be done later
npm i react-router-dom@5 
```

## Routes

It is possible to define the different routes available in the application 
using the `Route` component:
```javascript
function App() {
    return (
        <div>
            <Route path='/welcome'>
                <Welcome />
            </Route>
            <Route path='/products'>
                <Products />
            </Route>
        </div>
    );
}
```
then in the `index.js` the `BrowserRouter` must be provided app wide:
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
```
Usually the components that are present in a route are moved to a separate
folder to distinguish them form the regular ones.

## Navigation

It is possible to create natigation links that are automatically managed by
react and give the user the feeling of changing page, by using:
```javascript
const MainHeader = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to='/welcome'>Welcome</Link>
                    </li>
                    <li>
                        <Link to='/products'>Products</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
```

### Active Route

It is possible to add a custom css class when the link is active by using `NavLink`:
```javascript
const MainHeader = () => {
    return (
        <header className={styles.header}>
            <nav>
                <ul>
                    <li>
                        <NavLink activeClassName={styles.active} to='/welcome'>
                            Welcome
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName={styles.active} to='/products'>
                            Products
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
```

## Route Parameters

It is possible to define route that accepts Parameters in this way:
```javascript
function App() {
    return (
        // ...
        <Route path='/products/:productId'>
            <ProductDetail />
        </Route>
        // ...
    );
}
```
then it is possible to get the parameter value in the component in this way:
```javascript
const ProductDetail = () => {
    const params = useParams();

    return (
        <section>
            <h1>Product Detail for product: {params.productId}</h1>
        </section>
    );
};
```

### Sub-Routes

By default all the matching routes are displayed, 
therefore using this configuration:
```javascript
function App() {
    return (
        // ...
        <Route path='/products'>
            <Products />
        </Route>
        <Route path='/products/:productId'>
            <ProductDetail />
        </Route>
        // ...
    );
}
```
both `Products` and `ProductDetail` will be displayed with the route `/products/1`.

To avoid this behaviour it is possible to use the `Switch` component:
```javascript
function App() {
    return (
        // ...
        <Switch>
            <Route path='/welcome'>
                <Welcome />
            </Route>
            <Route path='/products'>
                <Products />
            </Route>
            <Route path='/products/:productId'>
                <ProductDetail />
            </Route>
        </Switch>
        // ...
    );
}
```
in this case will be displayed the first route that matches the path, 
so with `/products/1` will be displayed the `Products` component and not the
`ProductDetail` one. This can be fixed by changing the order of the routes
or by adding `exact`:
```javascript
function App() {
    return (
        // ...
        <Switch>
            <Route path='/welcome'>
                <Welcome />
            </Route>
            <Route path='/products' exact>
                <Products />
            </Route>
            <Route path='/products/:productId'>
                <ProductDetail />
            </Route>
        </Switch>
        // ...
    );
}
```

## Nested Routes

It is possible to define nester routes that are evaluated only when the main onw
is active by adding a route to a component loaded inside another route:
```javascript
const Welcome = () => {
    return (
        <section>
            <h1>The Welcome Page.</h1>
            <Route path='/welcome/new-user'>
                <p>Welcome, new user!</p>
            </Route>
        </section>
    );
};
```

### Conditional Render

It is possible to avoid a lot of logic for conditional rendering just using 
the nested routes feature:
```javascript
const QuoteDetail = () => {
    // ...

    return (
        <>
            // ...
            <Route path='/quotes/:quoteId' exact>
                <div className='centered'>
                    <Link className='btn--flat' to={`/quotes/${quoteId}/comments`}>
                        Load Comments
                    </Link>
                </div>
            </Route>
            <Route path='/quotes/:quoteId/comments'>
                <Comments />
            </Route>
        </>
    );
};
```

### Route Match

It is possible to make the nested routes more robust to path changes using
the `useRouteMatch` hook:
```javascript
const QuoteDetail = () => {
    // ...
    const routeMatch = useRouteMatch();

    return (
        <>
            // ...
            <Route path={matchPath.path} exact>
                <div className='centered'>
                    <Link className='btn--flat' to={`${routeMatch.url}/comments`}>
                        Load Comments
                    </Link>
                </div>
            </Route>
            <Route path={`${routeMatch.path}/comments`}>
                <Comments />
            </Route>
        </>
    );
};

export default QuoteDetail;
```
or using location:
```javascript
const QuoteList = props => {
    // ...
    const location = useLocation();

    // ...

    const changeSortingHandler = () => {
        history.push(`${location.pathname}?sort=${isSortingAsc ? 'desc' : 'asc'}`);
    };

    return (
        // ...
    );
};
```

## User Redirection

It is possible to redirect the user to a default page by using `Redirect`:
```javascript
function App() {
    return (
        // ...
        <Switch>
            <Route path='/' exact>
                <Redirect to='/welcome' />
            </Route>
            <Route path='/welcome'>
                <Welcome />
            </Route>
            // ...
        </Switch>
        // ...
    );
}
```

### Page Not Found

Id is possible to display a default page for a non existing route in this way:
```javascript
function App() {
    return (
        // ...
        <Switch>
            <Route path='/' exact>
                // ...
            </Route>
            <Route path='/quotes' exact>
                // ...
            </Route>
            <Route path='/quotes/:quoteId'>
                // ...
            </Route>
            <Route path='/new-quote'>
                // ...
            </Route>
            <Route path='*'>
                <NotFound />
            </Route>
        </Switch>
        // ...
    );
}
```

## Programmatic Navigation

It is possible to programmatically navigate using the `useHistory` hook.
It allows to:
- **push**: navigate to a new page (go back still works)
- **replace**: change the current pate (go back will not work) 
- **goBack**: go to the previous page
- others..

an example of `push` usage is:
```javascript
const NewQuote = () => {
    const history = useHistory()

    const addQuoteHandler = quoteDate => {
        history.push('/quotes')
    };

    return <QuoteForm onAddQu0te={addQuoteHandler} />;
};
```

## Prevent Navigation

On an input page it is possible to prevent the user from accidentally change
the page using the `Prompt` component:
```javascript
const QuoteForm = props => {
    // ...
    const [isEntering, setIsEntering] = useState(false);

    // ...

    const formFocusHandler = () => {
        setIsEntering(true);
    };

    const finishEnteringHandler = () => {
        setIsEntering(false);
    };

    return (
        <>
            <Prompt
                when={isEntering}
                message={location => 'Are you sure you want to leave? Entered data will be lost.'}
            />
            <Card>
                <form
                    onFocus={formFocusHandler}
                    className={classes.form}
                    onSubmit={submitFormHandler}>
                    // ...
                    <div className={classes.actions}>
                        <button onClick={finishEnteringHandler} className='btn'>
                            Add Quote
                        </button>
                    </div>
                </form>
            </Card>
        </>
    );
};
```

## Query Parameters

It is possible to set the query Parameters and get their value in this way:
```javascript
const QuoteList = props => {
    const history = useHistory();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const isSortingAsc = queryParams.get('sort') === 'asc';

    const changeSortingHandler = () => {
        history.push('/quotes?sort=' + (isSortingAsc ? 'desc' : 'asc'));
    };

    return (
        <>
            <div className={classes.sorting}>
                <button onClick={changeSortingHandler}>
                    Sort {isSortingAsc ? 'Descending' : 'Ascending'}
                </button>
            </div>
            // ...
        </>
    );
};
```
it is also possible to use an object as push parameter:
```javascript
history.push({
    pathname: location.pathname,
    search: `?sort=${isSortingAsc ? 'desc' : 'asc'}`
});
```

## REST API

### Server

In the course is used [firebase](https://firebase.google.com/),
but I prefer something local like
[json-server](https://github.com/typicode/json-server):
```bash
npm install -g json-server

json-server --watch db.json -p 3333
# server listening at http://localhost:3333 
# by default is 3000, but this conflicts with default react
```
the content of `db.json` must be:
```json
{
    "quotes": [
        {
            "id": 1,
            "author": "Tizio",
            "text": "Some quote from Tizio."
        },
        {
            "id": 2,
            "author": "Caio",
            "text": "Some quote from Caio."
        },
        {
            "id": 3,
            "author": "Sempronio",
            "text": "Some quote from Sempronio."
        }
    ],
    "comments": [
        {
            "id": 1,
            "body": "some comment",
            "postId": 1
        }
    ]
}
```
I also adapted the request url in the code provided.

## React Router 6

To upgrade to the version 6, it is enought to run:
```bash
npm i react-router-dom@6
# or
npm i react-router-dom@latest
```

### Switch

The first component that is not supported in the new version is the `Switch`,
the new component is `Routes`.\
The syntax move from this:
```javascript
<Switch>
    <Routes>
        <Route path='/welcome'>
            <Welcome />
        </Route>
        <Route path='/products' exact>
            <Products />
        </Route>
        <Route path='/products/:productId'>
            <ProductDetail />
        </Route>
    </Routes>
</Switch>
```
to:
```javascript
<Routes>
    <Route path='/welcome' element={<Welcome />} />
    <Route path='/products' element={<Products />} />
    <Route path='/products/:productId' element={<ProductDetail />} />
</Routes>
```
by default the match of the routes is now `exact`,
it is not possible to load multiple routes at the same time.
Furthermore the order is not important anymore because the best match
will be chosen.

### NavLink

NavLink does not have anymore the `activeClassName`:
```javascript
<NavLink activeClassName={classes.active} to='/welcome'>
    Welcome
</NavLink>
```
but uses just `className`
but with a method that make available the navigation information that can
be used to determine if a route is active:
```javascript
<NavLink
    className={navData => (navData.isActive ? classes.active : '')}
    to='/welcome'>
    Welcome
</NavLink>
```

### Redirect

The `Redirect` component does not exists anymore:
```javascript
<Route path='/'>
    <Navigate to='/welcome' />
</Route>
```
the new component is `Navigate`:
```javascript
<Route path='/' element={<Navigate to='/Welcome' />} />
```
by default the new page is added to the stack, it is possible to replace it
in this way:
```javascript
<Route path='/' replace element={<Navigate to='/Welcome' />} />
```

### Nested Routes

Nested routes now cannot just be defined as before:
```javascript
const Welcome = () => {
    return (
        <section>
            <h1>The Welcome Page</h1>;
            <Route path='/welcome/new-user'>
                <p>Welcome, new user.</p>
            </Route>
        </section>
    );
};
```
but:
- must be wrapped inside `Routes`
- must be relative paths and not absolutes
- if the containing page must be displayed, it must be used the wildchart 
(from `/welcome` to `/welcome/*`)
````javascript
const Welcome = () => {
    return (
        <section>
            <h1>The Welcome Page</h1>
            <Routes>
                <Route path='/new-user' element={<p>Welcome, new user.</p>} />
            </Routes>
        </section>
    );
};
````

### Link

In components that are loaded inside a route the Link component uses relative 
path in the `to` definition:
```javascript
const Welcome = () => {
    return (
        <section>
            <h1>The Welcome Page</h1>
            // /new-user was not working to me, I had to put ./new-user
            <Link to='./new-user'>New User</Link>
            <Routes>
                <Route path='/new-user' element={<p>Welcome, new user.</p>} />
            </Routes>
        </section>
    );
};

export default Welcome;
```

### Nested Routes Definition

A new way to define nested routes is inside other routes:
```javascript
<Routes>
    // ...
    <Route path='/welcome/*' element={<Welcome />}>
        <Route path='/new-user' element={<p>Welcome, new user.</p>} />
    </Route>
    // ...
</Routes>
```
When more than one component is active with a route, like in this case,
it is necessary to add a placeholder to tell react where to add the new
content:
```javascript
const Welcome = () => {
    return (
        <section>
            <h1>The Welcome Page</h1>
            <Link to='./new-user'>New User</Link>
            <Outlet />
        </section>
    );
};
```

### useHistory

The `useHistory` hook does not exists anymore, on his place there is
`useNavigate`:
```javascript
const navigate = useNavigate();
navigate('/my/page'); // push
navigate('/my/page', {replace: true}); // replace
navigate(-1); // go back
navigate(-2); // go back of 2 pages
navigate(1); // go forward
navigate(2); // go forward of 2 pages
```

### Prompt

At the time the tutorial is done the `Prompt` component is not present.

On this place there are:
- `usePrompt('text', isBlocking)` when navigate to another route
- `useBlocker(() => 'text', isBlocking)` when navigating away

