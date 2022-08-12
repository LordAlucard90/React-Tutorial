import axios from 'axios';
import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
    const passwordRef = useRef();
    const { userId, token, logout } = useContext(AuthContext);

    const submitHandler = event => {
        event.preventDefault();

        axios
            .patch(
                `http://localhost:3333/users/${userId}`,
                {
                    password: passwordRef.current.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then(response => {
                // forcing the user to login again
                logout()
            })
            .catch(err => {
                var message = 'Update failed.';
                if (!!err?.response?.data) {
                    message = err.response.data;
                }
                alert(message);
            });
    };

    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input ref={passwordRef} type='password' id='new-password' />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
};

export default ProfileForm;
