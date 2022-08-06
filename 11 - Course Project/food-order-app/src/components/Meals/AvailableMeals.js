import styles from './AvailableMeals.module.css';

import MealItem from './MealItem/MealItem';
import Card from '../UI/Card';
import { useEffect, useState } from 'react';
import axios from 'axios';

// const MEALS = [
//     {
//         id: 'm1',
//         name: 'Pizza',
//         description: 'The real Italian one',
//         price: 11.99,
//     },
//     {
//         id: 'm2',
//         name: 'Double Cheese Burger',
//         description: 'Double cheese, double Yum!',
//         price: 15.99,
//     },
//     {
//         id: 'm3',
//         name: 'Sushi',
//         description: "Tokyo's style!",
//         price: 23.99,
//     },
// ];

const AvailableMeals = () => {
    const [meals, setMeals] = useState([]);
    // since the use effect send the request as soon as the component is loaded
    // it is possible to use directly the true state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        axios
            .get('http://localhost:3333/meals')
            .then(response => {
                // console.log(response.data);
                setMeals(response.data);
            })
            .catch(response => {
                // console.log(response);
                setError(response.message)
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // const mealsList = MEALS.map(meal => {
    const mealsList = meals.map(meal => {
        return (
            <MealItem
                id={meal.id}
                key={meal.id}
                name={meal.name}
                description={meal.description}
                price={meal.price}
            />
        );
    });

    if (isLoading) {
        return (
            <section className={styles.mealsLoading}>
                <p>Loading...</p>
            </section>
        );
    }

    if (!!error) {
        return (
            <section className={styles.mealsError}>
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className={styles.meals}>
            <Card>
                <ul>{mealsList}</ul>
            </Card>
        </section>
    );
};

export default AvailableMeals;
