# Http

## Content

- [REST API](#rest-api)
- [GET](#get)
- [Loading State](#loading-state)
- [Errors](#errors)
- [Fetch On Load](#fetch-on-load)
- [POST](#post)

---

## REST API

### Server

In the course is used [SWAPI](https://swapi.dev/) 
and [firebase](https://firebase.google.com/),
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
    "movies": [
        {
            "id": 1,
            "title": "Some Dummy Movie",
            "openingText": "This is the opening text of the movie",
            "releaseDate": "2021-05-18"
        },
        {
            "id": 2,
            "title": "Some Dummy Movie 2",
            "openingText": "This is the second opening text of the movie",
            "releaseDate": "2021-05-19"
        }
    ]
}
```

### Http Client

It can be used external libraries like [axios](https://axios-http.com/docs/intro)
or built in like [fetch](https://it.javascript.info/fetch).\
In the course is used fetch, but i prefer axios, so I will use that one, 
to install:
```bash
npm i axios
```

## GET

#### Promises

The movies set on the `db.json` can be fetched in this way:
```javascript
function App() {
    const [movies, setMovies] = useState([]);

    const fetchMovies = () => {
        axios.get('http://localhost:3333/movies').then(response => {
            setMovies(response.data);
        });
    };

    return (
        <React.Fragment>
            <section>
                <button onClick={fetchMovies}>Fetch Movies</button>
            </section>
            <section>
                <MoviesList movies={movies} />
            </section>
        </React.Fragment>
    );
}
```

#### Async Await

The same logic can be implemented using `async/await` in this way:
```javascript
const fetchMovies = async () => {
    const response = await axios.get('http://localhost:3333/movies');
    setMovies(response.data);
};
```

## Loading State

It is possible to manages loading state or no fetched data in this way:
```javascript
const [isLoading, setIsLoading] = useState(false);

const fetchMovies = () => {
    setIsLoading(true)
    axios.get('http://localhost:3333/movies').then(response => {
        // console.log(response.data);
        setMovies(response.data);
        setIsLoading(false)
    });
};

return (
    // ...
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>Nothing found.</p>}
        {isLoading && <p>Loading...</p>}
    // ...
)
```

## Errors

#### Promises

It is possible to manage an error message using promisses in this way:
```javascript
const [error, setError] = useState(undefined);

const fetchMovies = () => {
    setIsLoading(true);
    axios
        .get('http://localhost:3333/movie') // wrong url
        .then(response => {
            setMovies(response.data);
        })
        .catch(err => {
            setError(err.message)
        })
        .finally(() => {
            setIsLoading(false);
        });
};

return (
    // ...
    {!isLoading && movies.length === 0 && !error && <p>Nothing found.</p>}
    {!isLoading && error && <p>{error}</p>}
    // ...
);
```


#### Async Await

```javascript
const [error, setError] = useState(undefined);

const fetchMovies = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get('http://localhost:3333/movies'); // fake error
        setMovies(response.data);
    } catch (err) {
        setError(err.message)
    } finally {
        setIsLoading(false);
    }
};

return (
    // ...
    {!isLoading && movies.length === 0 && !error && <p>Nothing found.</p>}
    {!isLoading && error && <p>{error}</p>}
    // ...
);
```

## Fetch On Load

It is possible to load the movies at the first render of the component using
`useEffect`, since the function `fetchMovies` can change over time, for example
if the there is an access token, the `fetchMovies` should be added as dependency
and wrapper with `useCallback` to ensure that it is not recreated every time
unless it is not necessary:
```javascript
const fetchMovies = useCallback(() => {
    setIsLoading(true);
    axios
        .get('http://localhost:3333/movies')
        // .get('http://localhost:3333/movie')
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
//         const response = await axios.get('http://localhost:3333/movies');
//         // fake error
//         // const response = await axios.get('http://localhost:3333/movie');
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
```

## POST

It is possible to send a post request just using:
```javascript
const baseUrl = 'http://localhost:3333/movies/';

const addMovieHandler = movie => {
    axios
        .post(baseUrl, movie, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => {
            setMovies(cur => [...cur, response.data]);
        });
};
```
it is also possible to add all the error handling or usint the async-awayt 
syntax as before.

