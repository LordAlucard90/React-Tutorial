import { useContext } from 'react';
import { Todo } from '../models/todo';
import { TodosContext } from '../store/todos-context';
import TodoItem from './TodoItem';
import styles from './Todos.module.css';

type TodosProps = {
    items: Todo[];
    onRemoveTodo: (id: string) => void;
};

// this syntax has been deprecated
// const Todos: React.FC<{items: string[]}> = (props) => {
// in favor of
// const Todos = (props: { items: string[] }) => {
// const Todos = (props: TodosProps) => {
const Todos = () => {
    const todosContext = useContext(TodosContext);

    return (
        <ul className={styles.todos}>
            {
                // props.items.map((item, index) => ( <li key={index}>{item}</li>))
                // props.items.map(item => ( <li key={item.id}>{item.text}</li>))
                // props.items.map(item => ( <TodoItem key={item.id} text={item.text} onRemoveTodo={props.onRemoveTodo.bind(null, item.id)} />))
                todosContext.items.map(item => (
                    <TodoItem
                        key={item.id}
                        text={item.text}
                        onRemoveTodo={todosContext.removeTodo.bind(null, item.id)}
                    />
                ))
            }
        </ul>
    );
};

export default Todos;
