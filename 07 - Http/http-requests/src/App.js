import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';
import axios from 'axios';

const baseUrl = 'http://localhost:3333/movies/';

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const fetchMovies = useCallback(() => {
        setIsLoading(true);
        axios
            .get(baseUrl)
            .then(response => {
                // console.log(response.data);
                setMovies(response.data);
            })
            .catch(err => {
                // console.log(err.message);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // const fetchMovies = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.get(baseUrl);
    //         setMovies(response.data);
    //     } catch (err) {
    //         console.log(err.message);
    //         setError(err.message)
    //     } finally {
    //         setIsLoading(false);
    //     }
    //     // console.log(response.data);
    // }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const addMovieHandler = movie => {
        // console.log(movie);
        axios
            .post(baseUrl, movie, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => {
                setMovies(cur => [...cur, response.data]);
            });
    };

    // const dummyMovies = [
    //     {
    //         id: 1,
    //         title: 'Some Dummy Movie',
    //         openingText: 'This is the opening text of the movie',
    //         releaseDate: '2021-05-18',
    //     },
    //     {
    //         id: 2,
    //         title: 'Some Dummy Movie 2',
    //         openingText: 'This is the second opening text of the movie',
    //         releaseDate: '2021-05-19',
    //     },
    // ];

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler} />
            </section>
            <section>
                <button onClick={fetchMovies}>Fetch Movies</button>
            </section>
            <section>
                {
                    // <MoviesList movies={dummyMovies} />
                }
                {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
                {!isLoading && movies.length === 0 && !error && <p>Nothing found.</p>}
                {!isLoading && error && <p>{error}</p>}
                {isLoading && <p>Loading...</p>}
            </section>
        </React.Fragment>
    );
}

export default App;
