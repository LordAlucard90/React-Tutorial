# Typescript

## Content

- [Intro](#intro)
- [React Installation](#react-installation)
- [Components](#components)
- [Data Props](#data-props)
- [Forms](#forms)
- [State](#state)
- [Styling](#styling)
- [Context](#context)

---

## Intro

Since I already did a Typescript tutorial, I do not report all that bascis,
(that are good in this course but actually just a quick introduction),
and instaed I link my other repo:
[TypeScript-Tutorial](https://github.com/LordAlucard90/TypeScript-Tutorial)

In this repo is also covered a react integration, but the one coming in this
course is actually much better.

## React Installation

It is either possible to create a new project with react directly:
```bash
npx create-react-app <app_name> --template typescript
```
or add it to an existing one:
```bash
npm i typescript @types/node @types/react @types/react-dom @types/jest
```
The file extension used by this king of project is `.ts` or `.tsx`
the second one is better because it says explicitely that it is using
the special JSX sintax in a typescript file.

When starting the project with `npm start` or `npm build`, the code is not only compile,
but also translated form typescript to normal javascript code.

It can be important, expecially at the beginning, to remove the `StrictMode`:
```typescript
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
```
this is while the types are then stricly checked and for example null or undefined
values are not allowed in the declaration.

## Components

Generally the components definition with the return of JSX code does not changes.

For example this code works in typescript as in javascript:

App:
```typescript
import Todos from './components/Todos';

function App() {
    return (
        <div>
            <Todos />
        </div>
    );
}

export default App;
```
Todos:
```typescript
const Todos = () => {
    return (
        <ul>
            <li>First</li>
            <li>Second</li>
        </ul>
    );
};

export default Todos;
```

## Data Props

It is possible to use typescript to define the parameters passed as props:
```typescript
// this syntax has been deprecated
// const Todos: React.FC<{items: string[]}> = (props) => {
// in favor of
const Todos = (props: { items: string[] }) => {
    return (
        <ul>
            {props.items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
};
```
In case these properties are not defined in the component definition,
a compilatin error is displayed:
```typescript
function App() {
    return (
        <div>
            // <Todos /> compilation error
            <Todos items={[]} /> // ok
            <Todos items={['first', 'second']} /> // ok
        </div>
    );
}
```

### Adding A Type

It is possible to improve the code above adding the `Todo` type:
```typescript
export class Todo {
    id: string;
    text: string;

    constructor(text: string) {
        this.text = text;
        this.id = Math.random().toString();
    }
}
```
the components become:
```typescript
const Todos = (props: { items: Todo[] }) => {
    return (
        <ul>
            {props.items.map(item => (
                    <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    );
};

function App() {
    const todos = [new Todo('first'), new Todo('second')];
    return (
        <div>
            <Todos items={todos} />
        </div>
    );
}
```
It is also possible to define a local type for the props in this way:
```typescript
type TodoItemProps = { text: string };

const TodoItem = (props: TodoItemProps) => {
    return <li>{props.text}</li>;
};
```
the caller component becomes:
```typescript
const Todos = (props: { items: Todo[] }) => {
    return (
        <ul>
            {props.items.map(item => (
                    <TodoItem key={item.id} text={item.text} />
            ))}
        </ul>
    );
};
```
the `key` type is supported by default by react, other properties
are not allowed if are not defined in the props type (or any is used).

## Forms

Forms management with typescript looks like this:
```typescript
const NewTodo = () => {
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

        if (enteredText?.trim().length === 0) {
            // an error should be displayed
            return;
        }
    };

    return (
        <form onSubmit={submitHandler}>
            <label htmlFor='text'>Todo text</label>
            <input id='text' type='text' ref={textInputRef} />
            <button>Add Todo</button>
        </form>
    );
};
```
Both `onSubmit` and `ref` check the type, therefore if it is wrongly defined
it gives an error. 

## Callback Props

It is possible to define callback funciton in the props definition
using the funcion type:
```typescript
type NewTodoProps = {
    onAddTodo: (text: string) => void;
};

const NewTodo = (props: NewTodoProps) => {
    // ...

    const submitHandler = (event: FormEvent) => {
        // ...
        props.onAddTodo(enteredText);
    };

    return ( /* ... */);
};
```
and use it in the caller:
```typescript
function App() {
    // ...
    const addTodoHandler = (text: string) => {
        // todo
    };

    return (
        <div>
            <NewTodo onAddTodo={addTodoHandler} />
            <Todos items={todos} />
        </div>
    );
}
```

## State

The `useState` hook is a generic type where can be set the type of the managed state:
```typescript
function App() {
    // const todos = [new Todo('first'), new Todo('second')];
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodoHandler = (text: string) => {
        const newTodo = new Todo(text);

        setTodos(curTodos => {
            return curTodos.concat(newTodo);
        });
    };

    return ( /* ... */);
}
```

## Styling

The styling management ramains as before with the css modules.

## Context

It is possible to define the context using typescript in this way:
```typescript
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
```
the use of the provider does not change:
```typescript
function App() {
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
        // <div>
        //     <NewTodo onAddTodo={addTodoHandler} />
        //     <Todos items={todos} onRemoveTodo={removeTodoHandler} />
        // </div>
        <TodosContextProvider>
            <NewTodo />
            <Todos />
        </TodosContextProvider>
    );
}
```
and so the import, but this time the type is automatically inferred by the hook:
```typescript
// props not anymore needed
// const Todos = (props: TodosProps) => {
const Todos = () => {
    const todosContext = useContext(TodosContext);

    return (
        <ul className={styles.todos}>
            {
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

// props not anymore needed
// const NewTodo = (props: NewTodoProps) => {
const NewTodo = () => {
    const todosContext = useContext(TodosContext);

    // ...

    const submitHandler = (event: FormEvent) => {
        // ...

        // props.onAddTodo(enteredText);
        todosContext.addTodo(enteredText);
    };

    return ( /* ... */ );
};
```

