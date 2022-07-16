import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext({
    isLoggedIn: false,
    // default values, useful for autocompletion
    onLogout: () => {},
    // default values, useful for autocompletion
    onLogIn: (email, password) => {},
});

export const AuthContextProvider = props => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginHandler = (email, password) => {
        localStorage.setItem('isLoggedIn', 'yes');
        setIsLoggedIn(true);
    };

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const isUserLoggedIn = localStorage.getItem('isLoggedIn');

        if (isUserLoggedIn === 'yes') {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                onLogin: loginHandler,
                onLogout: logoutHandler,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
