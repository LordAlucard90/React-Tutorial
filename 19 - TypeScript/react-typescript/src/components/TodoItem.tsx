import styles from './TodoItem.module.css';

type TodoItemProps = {
    text: string;
    onRemoveTodo: () => void;
};

const TodoItem = (props: TodoItemProps) => {
    return (
        <li className={styles.item} onClick={props.onRemoveTodo}>
            {props.text}
        </li>
    );
};

export default TodoItem;
