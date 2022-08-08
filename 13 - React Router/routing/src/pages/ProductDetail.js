import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { productId } = useParams();

    return (
        <section>
            <h1>Product Detail for product: {productId}</h1>
        </section>
    );
};

export default ProductDetail;
