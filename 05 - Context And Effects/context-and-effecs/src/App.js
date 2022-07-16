import React, { useContext, useEffect, useState } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import AuthContext from './store/auth-context';

function App() {
    // console.log(localStorage.getItem('isLoggedIn'))
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    //
    // const loginHandler = (email, password) => {
    //     // We should of course check email and password
    //     // But it's just a dummy/ demo anyways
    //     localStorage.setItem('isLoggedIn', 'yes');
    //     setIsLoggedIn(true);
    // };
    //
    // useEffect(() => {
    //     const isUserLoggedIn = localStorage.getItem('isLoggedIn');
    //
    //     if (isUserLoggedIn === 'yes') {
    //         setIsLoggedIn(true);
    //     }
    // }, []);
    //
    // const logoutHandler = () => {
    //     localStorage.removeItem('isLoggedIn');
    //     setIsLoggedIn(false);
    // };

    const context = useContext(AuthContext);
    return (
        <>
            {
                // <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, onLogout: logoutHandler }}>
                // <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
            }
            <MainHeader />
            <main>
                {/* !isLoggedIn && <Login onLogin={loginHandler} /> */}
                {/* isLoggedIn && <Home onLogout={logoutHandler} /> */}
                {!context.isLoggedIn && <Login />}
                {context.isLoggedIn && <Home />}
            </main>
            {
                // </AuthContext.Provider>
            }
        </>
    );
}

export default App;
