import styles from './UsersList.module.css';
import Card from '../UI/Card';

const UsersList = props => {
    if (!props.users) {
        return '';
    }

    return (
        <Card className={styles.users}>
            <ul>
                {props.users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.age} years old)
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default UsersList;
