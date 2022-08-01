# Custom Hooks

## Content

- [Definition](#definition)
- [Usage](#usage)
- [State Access](#state-access)
- [Configuration](#configuration)
- [Server](#server)
- [Http Custom Hook](#http-custom-hook)

---

## Definition

A custom hook must be defined as a function that starts with `use`:
```javascript
const useCounter = () => {
    // ...
};

export default useCounter;
```

## Usage

To use a custom hook, it is enough to just call it in the desired component:
```javascript
const ForwardCounter = () => {
    useCounter()

    // code moved to the custom hook:
    // const [counter, setCounter] = useState(0);
    //
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCounter(prevCounter => prevCounter + 1);
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    // }, []);

    return <Card>{counter}</Card>;
};
```
all the state defined in the hook, will be tided up with the component and not
shared. therefore the following state and effect are only related to the 
current component that uses them:
```javascript
const useCounter = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);
};
```

## State Access

The state present in the custom hook can simply be accessed by returning it
in the `useCounter` definition:
```javascript
const useCounter = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return counter;
};
```

and used in the component directly:
```javascript
const ForwardCounter = () => {
    const counter = useCounter()

    return <Card>{counter}</Card>;
};

export default ForwardCounter;
```

## Configuration

Since a custom hook is just a function, it is possible to configure it using
parameters:
```javascript
const useCounter = (step = 1) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + step);
        }, 1000);

        return () => clearInterval(interval);
    }, [step]); // change in the dependencies

    return counter;
};
```
now `step` is a variable and for this reason must be added to the `useEffect`
dependencies.

the new parameter can be used in this way:
```javascript
const BackwardCounter = () => {
    const counter = useCounter(-1);

    // code replaced with the custom hook:
    // const [counter, setCounter] = useState(0);
    //
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     setCounter((prevCounter) => prevCounter - 1);
    //   }, 1000);
    //
    //   return () => clearInterval(interval);
    // }, []);

    return <Card>{counter}</Card>;
};
```

## Server

For the http custom hook section it is needed a server,
in the course is used [firebase](https://firebase.google.com/),
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
    "tasks": []
}
```
I also adapted the calls.

## Http Custom Hook

A generic http hook that menages the loading and error state is:
```javascript
const useHttp = (requestConfig, applyData) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async taskText => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(requestConfig.url, {
                method: !!requestConfig.method ? requestConfig.method : 'GET',
                headers: !!requestConfig.headers ? requestConfig.headers : {},
                body: !!requestConfig.body ? JSON.stringify(requestConfig.body) : null,
            });

            if (!response.ok) {
                throw new Error('Request failed!');
            }

            const data = await response.json();

            applyData(data);
        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    };

    return {
        isLoading,
        error,
        sendRequest,
    };
};
```

the hook can be used in the app component in this way:
```javascript
function App() {
    // moved to hook
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);

    const transformTasks = tasks => {
        const loadedTasks = [];

        for (const task in tasks) {
            loadedTasks.push({ id: tasks[task].id, text: tasks[task].text });
        }

        setTasks(loadedTasks);
    };

    const { isLoading, error, sendRequest: fetchTasks } = useHttp(
        {
            url: 'http://localhost:3333/tasks',
        },
        transformTasks,
    );

    // moved to hook
    // const fetchTasks = async taskText => {
    //     setIsLoading(true);
    //     setError(null);
    //     try {
    //         const response = await fetch('http://localhost:3333/tasks');
    //
    //         if (!response.ok) {
    //             throw new Error('Request failed!');
    //         }
    //
    //         const data = await response.json();
    //
               // moved to callback
    //         const loadedTasks = [];
    //
    //         for (const task in data) {
    //             loadedTasks.push({ id: data[task].id, text: data[task].text });
    //         }
    //
    //         setTasks(loadedTasks);
    //     } catch (err) {
    //         setError(err.message || 'Something went wrong!');
    //     }
    //     setIsLoading(false);
    // };

    useEffect(() => {
        fetchTasks();
    }, []);

    const taskAddHandler = task => {
        setTasks(prevTasks => prevTasks.concat(task));
    };

    return (
        <React.Fragment>
            <NewTask onAddTask={taskAddHandler} />
            <Tasks items={tasks} loading={isLoading} error={error} onFetch={fetchTasks} />
        </React.Fragment>
    );
}
```
since the `fetchTasks` method now is created in the `useHttp` hook, it must be 
moved as dependency. But is it is done it is created an infinite loop because
the hook is revalueated after the creation and a new function is generated
and so on.\
To avoid this it is necessary to wrap the `sendRequest` in an `useCallback` hook.
Since also the `applyData` callback and the `requestConfig` must not change,
it is possible to move the usage from the hook parameter to the sendRequest:
```javascript
const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async (requestConfig, applyData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(requestConfig.url, {
                method: !!requestConfig.method ? requestConfig.method : 'GET',
                headers: !!requestConfig.headers ? requestConfig.headers : {},
                body: !!requestConfig.body ? JSON.stringify(requestConfig.body) : null,
            });

            if (!response.ok) {
                throw new Error('Request failed!');
            }

            const data = await response.json();

            applyData(data);
        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    }, []);

    return {
        isLoading,
        error,
        sendRequest,
    };
};
```
the component will become:
```javascript
function App() {
    const [tasks, setTasks] = useState([]);

    const transformTasks = tasks => {
        const loadedTasks = [];

        for (const task in tasks) {
            loadedTasks.push({ id: tasks[task].id, text: tasks[task].text });
        }

        setTasks(loadedTasks);
    };

    const { isLoading, error, sendRequest: fetchTasks } = useHttp();

    useEffect(() => {
        fetchTasks(
            {
                url: 'http://localhost:3333/tasks',
            },
            transformTasks,
        );
    }, []);

    const taskAddHandler = task => {
        setTasks(prevTasks => prevTasks.concat(task));
    };

    return (
        <React.Fragment>
            <NewTask onAddTask={taskAddHandler} />
            <Tasks
                items={tasks}
                loading={isLoading}
                error={error}
                onFetch={() =>
                    fetchTasks(
                        {
                            url: 'http://localhost:3333/tasks',
                        },
                        transformTasks,
                    )
                }
            />
        </React.Fragment>
    );
}
```

