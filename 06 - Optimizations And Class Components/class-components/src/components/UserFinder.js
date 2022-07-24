import { Fragment, useState, useEffect, Component } from 'react';
import UserContext from '../store/user-context';

import styles from './UserFinder.module.css';
import Users from './Users';
import ErrorBoundary from './ErrorBoundary';

// const DUMMY_USERS = [
//     { id: 'u1', name: 'Tizio' },
//     { id: 'u2', name: 'Caio' },
//     { id: 'u3', name: 'Sempronio' },
// ];

class UserFinder extends Component {
    static contextType = UserContext;

    constructor() {
        super();
        this.state = {
            filteredUsers: [],
            searchTerm: '',
        };
    }

    // only run the first time the component is rendered
    componentDidMount() {
        // send a request to a server...
        // this.setState({ filteredUsers: DUMMY_USERS });
        this.setState({ filteredUsers: this.context.users });
    }

    // run on every change of props and state
    componentDidUpdate(prevProps, prevState) {
        // avoid infinite loop
        if (prevState.searchTerm !== this.state.searchTerm) {
            this.setState({
                // filteredUsers: DUMMY_USERS.filter(user =>
                filteredUsers: this.context.users.filter(user =>
                    user.name.includes(this.state.searchTerm),
                ),
            });
        }
    }

    searchChangeHandler = event => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        return (
            <Fragment>
                <div className={styles.finder}>
                    <input type='search' onChange={this.searchChangeHandler.bind(this)} />
                </div>
                <ErrorBoundary>
                    <Users users={this.state.filteredUsers} />
                </ErrorBoundary>
            </Fragment>
        );
    }
}

// const UserFinder = () => {
//     const [filteredUsers, setFilteredUsers] = useState(DUMMY_USERS);
//     const [searchTerm, setSearchTerm] = useState('');
//
//     useEffect(() => {
//         setFilteredUsers(DUMMY_USERS.filter(user => user.name.includes(searchTerm)));
//     }, [searchTerm]);
//
//     const searchChangeHandler = event => {
//         setSearchTerm(event.target.value);
//     };
//
//     return (
//         <Fragment>
//             <div className={styles.finder}>
//                 <input type='search' onChange={searchChangeHandler} />
//             </div>
//             <Users users={filteredUsers} />
//         </Fragment>
//     );
// };

export default UserFinder;
