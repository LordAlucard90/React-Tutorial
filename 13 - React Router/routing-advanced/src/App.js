import { Redirect, Route, Switch } from 'react-router-dom';

import AllQuotes from './pages/AllQuotes';
import QuoteDetail from './pages/QuoteDetail';
import NewQuote from './pages/NewQuote';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';

function App() {
    return (
        <div>
            <Layout>
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
            </Layout>
        </div>
    );
}

export default App;
