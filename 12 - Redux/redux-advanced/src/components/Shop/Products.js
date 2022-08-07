import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DUMMY_PRODUCTS = [
    {
        id: 1,
        price: 6,
        name: 'First',
        description: 'First product',
    },
    {
        id: 2,
        price: 7,
        name: 'Second',
        description: 'Second product',
    },
    {
        id: 3,
        price: 42,
        name: 'Third',
        description: 'Third product',
    },
];

const Products = props => {
    return (
        <section className={classes.products}>
            <h2>Buy your favorite products</h2>
            <ul>
                {DUMMY_PRODUCTS.map(cur => (
                    <ProductItem
                        key={cur.id}
                        id={cur.id}
                        title={cur.title}
                        price={cur.price}
                        description={cur.description}
                    />
                ))}
            </ul>
        </section>
    );
};

export default Products;
