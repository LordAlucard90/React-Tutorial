import { useRef, useState } from 'react';
import styles from './Checkout.module.css';

const isEmpty = value => value.trim() === '';
const isFiveChars = value => value.trim().length === 5;

const Checkout = props => {
    const [formValidity, setFormValidity] = useState({
        name: true,
        street: true,
        postCode: true,
        city: true,
    });

    const nameRef = useRef();
    const streetRef = useRef();
    const postCodeRef = useRef();
    const cityRef = useRef();

    const confirmHandler = event => {
        event.preventDefault();

        const name = nameRef.current.value;
        const street = streetRef.current.value;
        const postCode = postCodeRef.current.value;
        const city = cityRef.current.value;

        const isNameValid = !isEmpty(name);
        const isStreetValid = !isEmpty(street);
        const isPostCodeValid = isFiveChars(postCode);
        const isCityValid = !isEmpty(city);

        setFormValidity({
            name: isNameValid,
            street: isStreetValid,
            postCode: isPostCodeValid,
            city: isCityValid,
        });

        const isFormValid = isNameValid && isStreetValid && isPostCodeValid && isCityValid;

        if (!isFormValid) {
            return;
        }

        props.onConfirm({
            name,
            street,
            postCode,
            city,
        });
    };

    return (
        <form onSubmit={confirmHandler}>
            <div className={`${styles.control} ${!formValidity.name && styles.invalid}`}>
                <label htmlFor='name'>Your Name</label>
                <input type='text' id='name' ref={nameRef} />
                {!formValidity.name && <p>Please enter a valid Name</p>}
            </div>
            <div className={`${styles.control} ${!formValidity.street && styles.invalid}`}>
                <label htmlFor='street'>Your Street</label>
                <input type='text' id='street' ref={streetRef} />
                {!formValidity.street && <p>Please enter a valid Street</p>}
            </div>
            <div className={`${styles.control} ${!formValidity.postCode && styles.invalid}`}>
                <label htmlFor='post-code'>Your Post Code</label>
                <input type='text' id='post-code' ref={postCodeRef} />
                {!formValidity.postCode && (
                    <p>Please enter a valid Post Code (5 characters long)</p>
                )}
            </div>
            <div className={`${styles.control} ${!formValidity.city && styles.invalid}`}>
                <label htmlFor='city'>Your City</label>
                <input type='text' id='city' ref={cityRef} />
                {!formValidity.city && <p>Please enter a valid City</p>}
            </div>
            <div className={styles.actions}>
                <button type='button' onClick={props.onCancel}>
                    Cancel
                </button>
                <button className={styles.submit}>Confirm</button>
            </div>
        </form>
    );
};

export default Checkout;
