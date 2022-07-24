import { Component, useState } from 'react';
import User from './User';

import classes from './Users.module.css';

// const DUMMY_USERS = [
//     { id: 'u1', name: 'Tizio' },
//     { id: 'u2', name: 'Caio' },
//     { id: 'u3', name: 'Sempronio' },
// ];

class Users extends Component {
    constructor() {
        super();
        // the state must always be called state and must be an object
        this.state = {
            showUsers: true,
        };
    }

    componentDidUpdate() {
        if (this.props.users.length === 0) {
            throw new Error('No users provided!');
        }
    }

    toggleUsersHandler = () => {
        // the state is not overridden but merged
        // this.setState({});
        this.setState(curState => {
            return { showUsers: !curState.showUsers };
        });
    };

    render() {
        const usersList = (
            <ul>
                {this.props.users.map(user => (
                    <User key={user.id} name={user.name} />
                ))}
            </ul>
        );

        return (
            <div className={classes.users}>
                <button onClick={this.toggleUsersHandler.bind(this)}>
                    {this.state.showUsers ? 'Hide' : 'Show'} Users
                </button>
                {this.state.showUsers && usersList}
            </div>
        );
    }
}

// const Users = () => {
//     const [showUsers, setShowUsers] = useState(true);
//
//     const toggleUsersHandler = () => {
//         setShowUsers(curState => !curState);
//     };
//
//     const usersList = (
//         <ul>
//             {DUMMY_USERS.map(user => (
//                 <User key={user.id} name={user.name} />
//             ))}
//         </ul>
//     );
//
//     return (
//         <div className={classes.users}>
//             <button onClick={toggleUsersHandler}>{showUsers ? 'Hide' : 'Show'} Users</button>
//             {showUsers && usersList}
//         </div>
//     );
// };

export default Users;
