import React, { ReactNode, useState } from 'react';
import { Todo } from '../models/todo';

type TodosContextProps = {
    items: Todo[];
    addTodo: (text: string) => void;
    removeTodo: (id: string) => void;
};

export const TodosContext = React.createContext<TodosContextProps>({
    items: [],
    addTodo: () => {},
    removeTodo: (id: string) => {},
});

type TodosContextProviderProps = { children: ReactNode };

const TodosContextProvider = (props: TodosContextProviderProps) => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodoHandler = (text: string) => {
        const newTodo = new Todo(text);

        setTodos(curTodos => {
            return curTodos.concat(newTodo);
        });
    };

    const removeTodoHandler = (todoId: string) => {
        setTodos(curTodos => {
            return curTodos.filter(cur => cur.id !== todoId);
        });
    };

    const contextValue: TodosContextProps = {
        items: todos,
        addTodo: addTodoHandler,
        removeTodo: removeTodoHandler,
    };

    return <TodosContext.Provider value={contextValue}>{props.children}</TodosContext.Provider>;
};

export default TodosContextProvider;
