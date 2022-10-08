import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/actions/product.actions';
import MetaData from './layout/MetaData'
import Product from './product/Product';
import Loader from './layout/Loader';
import { useAlert } from 'react-alert';
import Pagination from "react-js-pagination";
import { useParams } from 'react-router-dom';
// import Slider from 'react-rangeslider'
// import 'react-rangeslider/lib/index.css'
import Slider from '@mui/material/Slider';

const Home = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const {
        products,
        productsCount,
        resPerPage,
        error,
        loading,
        filteredProductsCount } = useSelector(state => state.products)

    const { keyword } = useParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 1000])
    const [category, setCategory] = useState('')

    const categories = [
        'All',
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

 
    useEffect(() => {

        if (error) {
            return alert.error(error)
        }

        dispatch(getProducts(currentPage, keyword, price, category))

    }, [dispatch,
        error,
        alert,
        currentPage,
        keyword,
        price,
        category])

    const setCurrentPageNo = (page) => {
        setCurrentPage(page)
    }

    const setRangeValue = (event, value) => {
        setPrice(value)
    }


  
    let count = productsCount
    // if (keyword) {
    //     count = filteredProductsCount
    // }


    // useEffect(() => {
    //     console.log(count);
    // }, [count])


    return (
        <>
            <MetaData title={'Buy Best Products Online'} />

            <h1 id='products_heading'>Latest Products</h1>

            <section id="products" className="container mt-5">
                <div className="row">
                    <div className='col-12 col-md-3 mt-3'>
                        <div className="price">
                            <h2>Price</h2>
                            <Slider
                                value={price}
                                onChange={setRangeValue}
                                min={0}
                                max={1000}
                                valueLabelDisplay="auto"
                            />
                        </div>

                        <div className="category mt-5">
                            <h2>Categories</h2>

                            <ul className='p-0'>
                                {categories.map(category => (
                                    <li
                                        style={{ cursor: 'pointer', listStyleType: 'none' }}
                                        key={category}
                                        onClick={() => category === 'All' ? setCategory('') : setCategory(category)}>
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {loading ? <Loader /> :
                        <div className="col-9">
                            <div className="row">
                                {products && products.map(product => (
                                    <Product key={product._id} product={product} />
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </section>
            {count > resPerPage &&
                <div className="d-flex justify-content-center mt-5">
                    <Pagination
                        activePage={currentPage}
                        totalItemsCount={productsCount}
                        itemsCountPerPage={resPerPage}
                        onChange={setCurrentPageNo}
                        nextPageText={'Next'}
                        prevPageText={'Previous'}
                        firstPageText={'First'}
                        lastPageText={'Last'}
                        itemClass='page-item'
                        linkClass='page-link'
                    />
                </div>
            }
        </>
    );
};

export default Home;