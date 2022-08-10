import { useEffect } from 'react';
import { Link, matchPath, Route, useParams, useRouteMatch } from 'react-router-dom';

import Comments from '../components/comments/Comments';
import HighlightedQuote from '../components/quotes/HighlightedQuote';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import useHttp from '../hooks/use-http';
import { getSingleQuote } from '../lib/api';

// const DUMMY_QUOTES = [
//     {
//         id: 1,
//         author: 'Tizio',
//         text: 'Some quote from Tizio.',
//     },
//     {
//         id: 2,
//         author: 'Caio',
//         text: 'Some quote from Caio.',
//     },
//     {
//         id: 3,
//         author: 'Sempronio',
//         text: 'Some quote from Sempronio.',
//     },
// ];

const QuoteDetail = () => {
    const { quoteId } = useParams();
    const routeMatch = useRouteMatch();

    const { sendRequest, status, data: quote, error } = useHttp(getSingleQuote, true);

    // const quote = DUMMY_QUOTES.find(cur => cur.id === +quoteId);

    useEffect(() => {
        sendRequest(quoteId);
    }, [sendRequest, quoteId]);

    if (status === 'pending') {
        return (
            <div className='centered'>
                <LoadingSpinner />
            </div>
        );
    }

    if (!!error) {
        return <p className='centered'>{error}</p>;
    }

    if (!quote.text) {
        return <p>No quote found.</p>;
    }

    return (
        <>
            <HighlightedQuote text={quote.text} author={quote.author} />
            {
                // <h1>quote detail : {quoteId}</h1>
                // <Route path={`/quotes/${quoteId}/comments`}>
            }
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
