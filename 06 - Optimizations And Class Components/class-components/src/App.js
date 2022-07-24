import Users from './components/Users';
import UserFinder from './components/UserFinder';
import UserContext from './store/user-context';
import { useContext } from 'react';

const DUMMY_USERS = [
    { id: 'u1', name: 'Tizio' },
    { id: 'u2', name: 'Caio' },
    { id: 'u3', name: 'Sempronio' },
];

function App() {
    const userContext = {
        users: DUMMY_USERS,
    };

    return (
        <div>
            {
                // <Users />
            }
            <UserContext.Provider value={userContext}>
                <UserFinder />
            </UserContext.Provider>
        </div>
    );
}

export default App;
