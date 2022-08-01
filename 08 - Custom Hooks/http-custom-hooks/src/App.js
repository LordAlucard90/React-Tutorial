import React, { useCallback, useEffect, useState } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
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

    const { isLoading, error, sendRequest: fetchTasks } = useHttp();

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

export default App;
