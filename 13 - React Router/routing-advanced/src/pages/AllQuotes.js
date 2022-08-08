import { useEffect } from 'react';
import QuoteList from '../components/quotes/QuoteList';
import NoQuotesFound from '../components/quotes/NoQuotesFound';
import LoadingSpinner from '../components/UI/LoadingSpinner';

import useHttp from '../hooks/use-http';
import { getAllQuotes } from '../lib/api';

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

const AllQuotes = () => {
    const { sendRequest, status, data: loadedQuotes, error } = useHttp(getAllQuotes, true);

    useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    if (status === 'pending') {
        return (
            <div className='centered'>
                <LoadingSpinner />
            </div>
        );
    }

    if (!!error) {
        return <p className='centered focussed'>{error}</p>;
    }

    if (status === 'completed' && (!loadedQuotes || loadedQuotes.length === 0)) {
        return <NoQuotesFound />
    }

    // return <QuoteList quotes={DUMMY_QUOTES} />;
    return <QuoteList quotes={loadedQuotes} />;
};

export default AllQuotes;
