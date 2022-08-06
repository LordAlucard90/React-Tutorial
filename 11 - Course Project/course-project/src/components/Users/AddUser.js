import styles from './AddUser.module.css';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ErrorModal from '../UI/ErrorModal';
import { useState } from 'react';

const AddUser = props => {
    const [userName, setUserName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState(undefined);

    const addUserHandler = event => {
        event.preventDefault();
        if (userName.trim().length === 0 || age.trim().length === 0) {
            setError({
                title: 'Invalid input',
                message: 'Please enter a valid name and age (not empty).',
            });
            return;
        }
        if (+age < 1) {
            setError({
                title: 'Invalid age',
                message: 'Please enter a valid age (> 0).',
            });
            return;
        }
        props.onAddUser(userName, age);
        // console.log(userName, age);
        setUserName('');
        setAge('');
    };

    const userNameChangedHandler = event => {
        setUserName(event.target.value);
    };

    const ageChangedHandler = event => {
        setAge(event.target.value);
    };

    const dismissErrorHandler = () => {
        setError(undefined);
    };

    return (
        <div>
            {error && (
                <ErrorModal
                    title={error.title}
                    message={error.message}
                    onClose={dismissErrorHandler}
                />
            )}
            <Card className={styles.input}>
                <form onSubmit={addUserHandler}>
                    <label htmlFor='username'>UserName</label>
                    <input
                        id='username'
                        type='text'
                        onChange={userNameChangedHandler}
                        value={userName}
                    />
                    <label htmlFor='age'>Age (Year)</label>
                    <input id='age' type='number' onChange={ageChangedHandler} value={age} />
                    <Button type='submit'>Add User</Button>
                </form>
            </Card>
        </div>
    );
};

export default AddUser;
