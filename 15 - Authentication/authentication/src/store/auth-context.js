const { createContext, useState, useEffect, useCallback } = require('react');

const AuthContext = createContext({
    userId: undefined,
    token: '',
    isLoggedIn: false,
    login: token => { },
    logout: () => { },
});

const calculareRemainingTime = expirationTime => {
    const currentTime = new Date().getTime();
    return expirationTime - currentTime;
};

const retrieveStoredToken = expirationTime => {
    const initialToken = localStorage.getItem('token');
    const initialUserId = +localStorage.getItem('userId');
    const initialExpirationTime = +localStorage.getItem('expirationTime');

    const remainingTime = calculareRemainingTime(initialExpirationTime);
    if (remainingTime <= 0) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationTime');
        return { initialToken: null, initialUserId: null, initialExpirationTime: null };
    }
    return {
        initialToken,
        initialUserId,
        initialExpirationTime,
    };
};

let logoutTimer;

export const AuthContextProvider = props => {
    const { initialToken, initialUserId, initialExpirationTime } = retrieveStoredToken();
    const [token, setToken] = useState(initialToken);
    const [userId, setUserId] = useState(initialUserId);

    const isLoggedIn = !!token;

    const logoutHangler = useCallback(() => {
        setToken('');
        setUserId(undefined);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationTime');
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHangler = (userId, token, expirationTime) => {
        setToken(token);
        setUserId(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationTime', expirationTime);
        const remainingTime = calculareRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHangler, remainingTime);
    };

    useEffect(() => {
        if (!!initialExpirationTime) {
            const remainingTime = calculareRemainingTime(initialExpirationTime);
            logoutTimer = setTimeout(logoutHangler, remainingTime);
        }
    }, [initialExpirationTime, logoutHangler]);

    const context = {
        userId: userId,
        token: token,
        isLoggedIn: isLoggedIn,
        login: loginHangler,
        logout: logoutHangler,
    };

    return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
