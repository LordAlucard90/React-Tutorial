import { useState } from 'react';
import './App.css';

import AddUser from './components/Users/AddUser';
import UsersList from './components/Users/UsersList';

const App = () => {
    const [users, setUsers] = useState([]);

    const userAddedHandler = (name, age) => {
        // console.log(name, age);
        setUsers(prev => [...prev, { name, age, id: Math.random().toString() }]);
    };

    return (
        <>
            <AddUser onAddUser={userAddedHandler} />
            <UsersList users={users} />
        </>
    );
    // return (
    //     <div>
    //         <AddUser onAddUser={userAddedHandler} />
    //         <UsersList users={users} />
    //     </div>
    // );
};

export default App;
