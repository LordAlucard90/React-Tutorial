import React, { useContext } from 'react';
import AuthContext from '../../store/auth-context';

import classes from './Navigation.module.css';

const Navigation = props => {
    // return (
    //     <AuthContext.Consumer>
    //         {context => {
    //             return (
    //                 <nav className={classes.nav}>
    //                     <ul>
    //                         {
    //                             // props.isLoggedIn
    //                             context.isLoggedIn && (
    //                                 <li>
    //                                     <a href='/'>Users</a>
    //                                 </li>
    //                             )
    //                         }
    //                         {
    //                             // props.isLoggedIn
    //                             context.isLoggedIn && (
    //                                 <li>
    //                                     <a href='/'>Admin</a>
    //                                 </li>
    //                             )
    //                         }
    //                         {
    //                             // props.isLoggedIn
    //                             context.isLoggedIn && (
    //                                 <li>
    //                                     <button onClick={props.onLogout}>Logout</button>
    //                                 </li>
    //                             )
    //                         }
    //                     </ul>
    //                 </nav>
    //             );
    //         }}
    //     </AuthContext.Consumer>
    // );
    const context = useContext(AuthContext);
    return (
        <nav className={classes.nav}>
            <ul>
                {
                    // props.isLoggedIn
                    context.isLoggedIn && (
                        <li>
                            <a href='/'>Users</a>
                        </li>
                    )
                }
                {
                    // props.isLoggedIn
                    context.isLoggedIn && (
                        <li>
                            <a href='/'>Admin</a>
                        </li>
                    )
                }
                {
                    // props.isLoggedIn
                    context.isLoggedIn && (
                        <li>
                            <button onClick={context.onLogout /* props.onLogout */}>Logout</button>
                        </li>
                    )
                }
            </ul>
        </nav>
    );
};

export default Navigation;
