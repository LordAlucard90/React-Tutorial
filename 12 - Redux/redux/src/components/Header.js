import { useDispatch, useSelector } from 'react-redux';
import classes from './Header.module.css';
// import { authActions } from '../store/index';
import { authActions } from '../store/auth';

const Header = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const logoutHandler = event => {
        dispatch(authActions.logout());
    };

    return (
        <header className={classes.header}>
            <h1>Redux Auth</h1>
            {isAuthenticated && (
                <nav>
                    <ul>
                        <li>
                            <a href='/'>My Products</a>
                        </li>
                        <li>
                            <a href='/'>My Sales</a>
                        </li>
                        <li>
                            <button onClick={logoutHandler}>Logout</button>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
