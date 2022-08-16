import { FormEvent, useContext, useRef } from 'react';
import { TodosContext } from '../store/todos-context';
import styles from './NewTodo.module.css';

type NewTodoProps = {
    onAddTodo: (text: string) => void;
};

// const NewTodo = (props: NewTodoProps) => {
const NewTodo = () => {
    const todosContext = useContext(TodosContext);

    // generic type depends on the element referentialted, needs a default value
    const textInputRef = useRef<HTMLInputElement>(null);

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();

        // since value can be null (string | undefine)
        // the access is safely managed with `?.`
        // it is possible force to string with `!.` if it is for SURE not null
        // const enteredText = textInputRef.current?.value;
        // I prefere in this case a default value
        const enteredText = textInputRef.current?.value || '';

        if (enteredText.trim().length === 0) {
            // an error should be displayed
            return;
        }

        // props.onAddTodo(enteredText);
        todosContext.addTodo(enteredText);
    };

    return (
        <form onSubmit={submitHandler} className={styles.form}>
            <label htmlFor='text'>Todo text</label>
            <input id='text' type='text' ref={textInputRef} />
            <button>Add Todo</button>
        </form>
    );
};

export default NewTodo;
