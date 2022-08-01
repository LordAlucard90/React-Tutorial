import { useState } from 'react';

import Section from '../UI/Section';
import TaskForm from './TaskForm';
import useHttp from '../../hooks/use-http';

const NewTask = props => {
    const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState(null);

    const createTask = taskData => {
        const generatedId = taskData.id;
        const createdTask = { id: generatedId, text: taskData.text };
        props.onAddTask(createdTask);
    };

    const enterTaskHandler = async taskText => {
        sendTaskRequest(
            {
                url: 'http://localhost:3333/tasks',
                method: 'POST',
                body: { text: taskText },
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            createTask,
        );
        //     setIsLoading(true);
        //     setError(null);
        //     try {
        //         const response = await fetch('http://localhost:3333/tasks', {
        //             method: 'POST',
        //             body: JSON.stringify({ text: taskText }),
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //         });
        //
        //         if (!response.ok) {
        //             throw new Error('Request failed!');
        //         }
        //
        //         const data = await response.json();
        //
        //         const generatedId = data.id;
        //         const createdTask = { id: generatedId, text: taskText };
        //
        //         props.onAddTask(createdTask);
        //     } catch (err) {
        //         setError(err.message || 'Something went wrong!');
        //     }
        //     setIsLoading(false);
    };

    return (
        <Section>
            <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
            {error && <p>{error}</p>}
        </Section>
    );
};

export default NewTask;
