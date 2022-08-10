# Deploy

## Content

- [Setup](#setup)
- [Lazy Loading](#lazy-loading)
- [Build](#build)
- [Hosting](#hosting)

---

## Setup

The basic project comes from the previous lecture 
and need the `json-server` to be run.

## Lazy Loading

It is possible to lazy load pages of an application in order to make faster
the first load of the site by the user and download the needed code only 
when the user actually visits a page:
```javascript
import React, { Suspense } from 'react';

// ...
// import QuoteDetail from './pages/QuoteDetail';
// import NewQuote from './pages/NewQuote';
// import NotFound from './pages/NotFound';

const QuoteDetail = React.lazy(() => import('./pages/QuoteDetail'));
const NewQuote = React.lazy(() => import('./pages/NewQuote'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
    const fallBackPage = (
        <div className='centered'>
            <LoadingSpinner />
        </div>
    );

    return (
        <div>
            <Layout>
                <Suspense fallback={fallBackPage}>
                    <Switch>
                        <Route path='/' exact>
                            <Redirect to='/quotes' />
                        </Route>
                        <Route path='/quotes' exact>
                            <AllQuotes />
                        </Route>
                        <Route path='/quotes/:quoteId'>
                            <QuoteDetail />
                        </Route>
                        <Route path='/new-quote'>
                            <NewQuote />
                        </Route>
                        <Route path='*'>
                            <NotFound />
                        </Route>
                    </Switch>
                </Suspense>
            </Layout>
        </div>
    );
}

export default App;
```
the pages are lazy loaded using this syntax:
```javascript
const NewQuote = React.lazy(() => import('./pages/NewQuote'));
```
and a fallbach page used during the load of the missing content is require:
```javascript
<Suspense fallback={fallBackPage}>
    <Switch>
        // ...
    </Switch>
</Suspense>
```
Now in the Browser dev tools it is possible to see a new network request
used to load the missing content when one of the missing page is loaded.
It can be not worth to lazy load the main page, because it will be everytime
loaded, it can be in anycase done if it is possible for the user to 
start also from another page.

## Build

The `npm start` script does not optimizes the code but runs it in a local
server in order to work on it in real time.

On the other end `npm run build` optimizes the code as much as possible 
and will not start a server:
```
$ npm run build

> routing-advanced@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  56.53 kB  build/static/js/main.0347eed1.js
  4.33 kB   build/static/js/292.47b44ec1.chunk.js
  1.43 kB   build/static/js/568.b4188e0d.chunk.js
  864 B     build/static/js/808.38bfd59c.chunk.js
  834 B     build/static/js/884.60232bed.chunk.js
  748 B     build/static/css/main.dd518351.css
  613 B     build/static/css/568.5f28b394.chunk.css
  563 B     build/static/css/808.d36a91c9.chunk.css
  463 B     build/static/css/884.c1165da1.chunk.css
  245 B     build/static/js/922.f2a9094e.chunk.js

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  https://cra.link/deployment

```
The above listed files are automatically generate and placed in the `build/` folder,
these files are the static files that must be used to deploy the application online.

## Hosting

The hosting procedure changes depending from the host, but in general
the static files must be uploaded in the host and that's mainly all.

It is important to be sure tha the server is configured to always serve
the index.html file and not the sub ones, otherwise it will result in a 404 error.

### Serve

It is possible to use [serve](https://github.com/vercel/serve) 
to host the build result locally:
```bash
sudo npm i -g serve

serve -s build/ # by defautl is hosted at http://localhost:3000
```

