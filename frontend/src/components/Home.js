import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/actions/product.actions';
import MetaData from './layout/MetaData'
import Product from './product/Product';
import Loader from './layout/Loader';
import { useAlert } from 'react-alert';

const Home = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const { products, productsCount, error, loading } = useSelector(state => state.products)

    useEffect(() => {
          
        if (error) {
            return alert.error(error)
        }

        dispatch(getProducts())


    }, [dispatch, error, alert])

    return (
        <>
            <MetaData title={'Buy Best Products Online'} />

            <h1 id='products_heading'>Latest Products</h1>

            {loading ? <Loader /> :
                <section id="products" className="container mt-5">
                    <div className="row">
                        {products && products.map(product => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            }
        </>
    );
};

export default Home;