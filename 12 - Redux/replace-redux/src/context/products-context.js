import { createContext, useState } from 'react';

const DUMMY_PRODUCTS = [
    {
        id: 'p1',
        title: 'Red Scarf',
        description: 'A pretty red scarf.',
        isFavorite: false,
    },
    {
        id: 'p2',
        title: 'Blue T-Shirt',
        description: 'A pretty blue t-shirt.',
        isFavorite: false,
    },
    {
        id: 'p3',
        title: 'Green Trousers',
        description: 'A pair of lightly green trousers.',
        isFavorite: false,
    },
    {
        id: 'p4',
        title: 'Orange Hat',
        description: 'Street style! An orange hat.',
        isFavorite: false,
    },
];

const ProductsContext = createContext({
    products: [],
    toggleFavorite: productId => { },
});

export const ProductsContextProvider = props => {
    const [productsList, setProductsList] = useState(DUMMY_PRODUCTS);

    const toggleFavorite = productId => {
        setProductsList(currentList => {
            const prodIndex = currentList.findIndex(p => p.id === productId);
            const newFavStatus = !currentList[prodIndex].isFavorite;
            const updatedProducts = [...productsList];
            updatedProducts[prodIndex] = {
                ...currentList[prodIndex],
                isFavorite: newFavStatus,
            };
            return updatedProducts;
        });
    };

    return (
        <ProductsContext.Provider
            value={{ products: productsList, toggleFavorite: toggleFavorite }}>
            {props.children}
        </ProductsContext.Provider>
    );
};

export default ProductsContext;
