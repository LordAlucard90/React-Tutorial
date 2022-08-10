import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// import AllQuotes from './pages/AllQuotes';
// import QuoteDetail from './pages/QuoteDetail';
// import NewQuote from './pages/NewQuote';
// import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';

const AllQuotes = React.lazy(() => import('./pages/AllQuotes'));
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
