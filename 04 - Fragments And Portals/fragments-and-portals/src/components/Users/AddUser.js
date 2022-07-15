import styles from './AddUser.module.css';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ErrorModal from '../UI/ErrorModal';
import Wrapper from '../Helpers/Wrapper';
import { useRef, useState } from 'react';

const AddUser = props => {
    // const [userName, setUserName] = useState('');
    // const [age, setAge] = useState('');
    const [error, setError] = useState(undefined);
    const nameRef = useRef();
    const ageRef = useRef();

    const addUserHandler = event => {
        event.preventDefault();
        console.log(nameRef.current.value, ageRef.current.value);
        const curName = nameRef.current.value;
        const curAge = ageRef.current.value;
        // if (userName.trim().length === 0 || age.trim().length === 0) {
        if (curName.length === 0 || curAge.length === 0) {
            setError({
                title: 'Invalid input',
                message: 'Please enter a valid name and age (not empty).',
            });
            return;
        }
        // if (+age < 1) {
        if (+curAge < 1) {
            setError({
                title: 'Invalid age',
                message: 'Please enter a valid age (> 0).',
            });
            return;
        }
        // props.onAddUser(userName, age);
        // console.log(userName, age);
        // setUserName('');
        // setAge('');
        props.onAddUser(curName, curAge);
        nameRef.current.value = '';
        ageRef.current.value = '';
    };

    // const userNameChangedHandler = event => {
    //     setUserName(event.target.value);
    // };

    // const ageChangedHandler = event => {
    //     setAge(event.target.value);
    // };

    const dismissErrorHandler = () => {
        setError(undefined);
    };

    return (
        <Wrapper>
            {
                // <div>
            }
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
                    {
                        // <input
                        // onChange={userNameChangedHandler}
                        // value={userName}
                    }
                    <input id='username' type='text' ref={nameRef} />
                    <label htmlFor='age'>Age (Year)</label>
                    {
                        // <input
                        // onChange={ageChangedHandler}
                        // value={age}
                        //
                    }
                    <input id='age' type='number' ref={ageRef} />
                    <Button type='submit'>Add User</Button>
                </form>
            </Card>
            {
                // </div>
            }
        </Wrapper>
    );
    // return [
    //     error && (
    //         <ErrorModal
    //             key='error-modal'
    //             title={error.title}
    //             message={error.message}
    //             onClose={dismissErrorHandler}
    //         />
    //     ),
    //     <Card key='add-user-car' lassName={styles.input}>
    //         <form onSubmit={addUserHandler}>
    //             <label htmlFor='username'>UserName</label>
    //             <input
    //                 id='username'
    //                 type='text'
    //                 onChange={userNameChangedHandler}
    //                 value={userName}
    //             />
    //             <label htmlFor='age'>Age (Year)</label>
    //             <input id='age' type='number' onChange={ageChangedHandler} value={age} />
    //             <Button type='submit'>Add User</Button>
    //         </form>
    //     </Card>,
    // ];
};

export default AddUser;
