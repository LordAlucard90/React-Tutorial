import { useState } from 'react';
import NewTodo from './components/NewTodo';
import Todos from './components/Todos';
import { Todo } from './models/todo';
import TodosContextProvider from './store/todos-context';

function App() {
    // const todos = [new Todo('first'), new Todo('second')];
    // const [todos, setTodos] = useState<Todo[]>([]);
    //
    // const addTodoHandler = (text: string) => {
    //     const newTodo = new Todo(text);
    //
    //     setTodos(curTodos => {
    //         return curTodos.concat(newTodo);
    //     });
    // };
    //
    // const removeTodoHandler = (todoId: string) => {
    //     setTodos(curTodos => {
    //         return curTodos.filter(cur => cur.id !== todoId);
    //     });
    // };

    return (
        <TodosContextProvider>
            {
                // <Todos items={['first', 'second']} />
            }
            {
                // <div>
                // <NewTodo onAddTodo={addTodoHandler} />
                // <Todos items={todos} onRemoveTodo={removeTodoHandler} />
                // </div>
            }
            <NewTodo />
            <Todos />
        </TodosContextProvider>
    );
}

export default App;
