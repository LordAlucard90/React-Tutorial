import { Navigate, Route, Routes /*, Switch */ } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MainHeader from './components/MainHeader';

function App() {
    return (
        <div>
            <MainHeader />
            <main>
                {
                    // <Switch>
                    //     <Routes>
                    //         <Route path='/welcome'>
                    //             <Welcome />
                    //         </Route>
                    //         <Route path='/products' exact>
                    //             <Products />
                    //         </Route>
                    //         <Route path='/products/:productId'>
                    //             <ProductDetail />
                    //         </Route>
                    //     </Routes>
                    // </Switch>
                }
                <Routes>
                    <Route path='' element={<Navigate replace to='welcome' />} />
                    <Route path='welcome/*' element={<Welcome />}>
                        <Route path='new-user' element={<p>Welcome, new user.</p>} />
                    </Route>
                    <Route path='products' element={<Products />} />
                    <Route path='products/:productId' element={<ProductDetail />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;

// our-domain.com/welcome => Welcome Component
// our-domain.com/products => Products Component
// our-domain.com/product-detail/a-book
