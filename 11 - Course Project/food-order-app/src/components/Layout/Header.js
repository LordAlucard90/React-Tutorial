import styles from './Header.module.css';

import mealsImage from '../../assets/meals.jpg';
import HeaderCartButton from './HeaderCartButton';

const Header = (props) => {
    return (
        <>
            <header className={styles.header}>
                <h1>Meals</h1>
                <HeaderCartButton onClick={props.onShowCart} />
            </header>
            <div className={styles['main-image']}>
                <img src={mealsImage} alt='A table of foods.' />
            </div>
        </>
    );
};

export default Header;
