import Counter from './components/Counter';
import Header from './components/Header';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { useSelector } from 'react-redux';

function App() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return (
        <>
            <Header />
            {isAuthenticated ? <UserProfile /> : <Auth />}
            <Counter />
        </>
    );
}

export default App;
